"""
Namma Kannada API - Quiz & Gamification Router
Quiz questions, submissions, leaderboard, and user profiles.
"""

from typing import List, Optional

from fastapi import APIRouter, Depends

from app.core.security import get_current_user
from app.models.schemas import (
    BadgeType,
    DialectRegion,
    LeaderboardResponse,
    QuizQuestion,
    QuizResult,
    QuizSubmission,
    UserProfile,
)
from app.services.dialect_translator import DialectTranslatorService
from app.services.firestore_service import FirestoreService

router = APIRouter(prefix="/quiz", tags=["Gamification"])


@router.get("/questions", response_model=List[QuizQuestion])
async def get_quiz_questions(
    region: Optional[DialectRegion] = None,
    count: int = 5,
):
    """Generate quiz questions, optionally filtered by dialect region."""
    translator = DialectTranslatorService()
    questions = await translator.generate_quiz_questions(
        region=region,
        count=count,
    )
    return [QuizQuestion(**q) for q in questions]


@router.post("/submit", response_model=QuizResult)
async def submit_quiz(
    submissions: List[QuizSubmission],
    current_user: dict = Depends(get_current_user),
):
    """Submit quiz answers and receive score, badges, and streak info."""
    firestore_svc = FirestoreService()

    # Fetch correct answers and calculate score
    total = len(submissions)
    correct = 0
    score = 0

    for sub in submissions:
        question = await firestore_svc.get_quiz_question(sub.question_id)
        if question and sub.user_answer == question.get("correct_answer"):
            correct += 1
            score += question.get("points", 10)

    # Check for newly earned badges
    profile = await firestore_svc.get_user_profile(current_user["uid"])
    existing_badges = set(profile.get("badges", [])) if profile else set()

    new_badges: List[BadgeType] = []
    if score >= 50 and BadgeType.QUIZ_MASTER not in existing_badges:
        new_badges.append(BadgeType.QUIZ_MASTER)

    # Update user profile with new score and badges
    streak = await firestore_svc.update_user_score(
        uid=current_user["uid"],
        score_delta=score,
        new_badges=new_badges,
    )

    return QuizResult(
        total_questions=total,
        correct_answers=correct,
        score=score,
        badges_earned=new_badges,
        streak=streak,
    )


@router.get("/leaderboard", response_model=LeaderboardResponse)
async def get_leaderboard(limit: int = 50):
    """Get the global leaderboard."""
    firestore_svc = FirestoreService()
    result = await firestore_svc.get_leaderboard(limit=limit)
    return LeaderboardResponse(**result)


@router.get("/profile", response_model=UserProfile)
async def get_profile(current_user: dict = Depends(get_current_user)):
    """Get the current user's gamification profile."""
    firestore_svc = FirestoreService()
    profile = await firestore_svc.get_user_profile(current_user["uid"])
    if not profile:
        # Return a default empty profile
        from datetime import datetime, timezone
        profile = {
            "uid": current_user["uid"],
            "display_name": current_user.get("display_name", "Anonymous"),
            "total_contributions": 0,
            "total_score": 0,
            "badges": [],
            "favorite_regions": [],
            "rank": 0,
            "joined_at": datetime.now(timezone.utc),
        }
    return UserProfile(**profile)
