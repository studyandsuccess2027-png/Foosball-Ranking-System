from math import pow
# ============================================================
# Default Elo Configuration
# ============================================================
# Default Elo starting rating
DEFAULT_ELO = 1000
# K-factor controls how quickly ratings change
K_FACTOR = 32
# ============================================================
# Elo Utility Functions
# ============================================================
def expected_score(rating_a, rating_b):
    """
    Calculate the expected probability of player A winning.
    """
    return 1 / (
        1 + pow(10, (rating_b - rating_a) / 400)
    )
def calculate_new_rating(
    current_rating,
    opponent_rating,
    actual_score,
    k_factor=K_FACTOR
):
    """
    Calculate a player's new Elo rating.
    actual_score:
        1   = win
        0   = loss
        0.5 = draw
    """
    expected = expected_score(
        current_rating,
        opponent_rating
    )
    new_rating = current_rating + (
        k_factor * (
            actual_score - expected
        )
    )
    return round(new_rating)

# ============================================================
# Normal Match Elo
# ============================================================
def calculate_match_ratings(
    player1_rating,
    player2_rating,
    winner_id,
    player1_id,
    player2_id
):
    """
    Calculate new ratings for both players
    in a normal match.
    """
    player1_expected = expected_score(
        player1_rating,
        player2_rating
    )
    player2_expected = expected_score(
        player2_rating,
        player1_rating
    )
    if winner_id == player1_id:
        player1_actual = 1
        player2_actual = 0
    elif winner_id == player2_id:
        player1_actual = 0
        player2_actual = 1
    else:
        # Draw
        player1_actual = 0.5
        player2_actual = 0.5
    new_player1_rating = round(
        player1_rating +
        K_FACTOR * (
            player1_actual -
            player1_expected
        )
    )
    new_player2_rating = round(
        player2_rating +
        K_FACTOR * (
            player2_actual -
            player2_expected
        )
    )
    return {
        "player1_old_rating": player1_rating,
        "player2_old_rating": player2_rating,
        "player1_new_rating":
            new_player1_rating,
        "player2_new_rating":
            new_player2_rating,
        "player1_change":
            new_player1_rating -
            player1_rating,
        "player2_change":
            new_player2_rating -
            player2_rating
    }
# ============================================================
# Tournament Match Elo
# ============================================================
def calculate_tournament_ratings(
    player1_rating,
    player2_rating,
    winner_id,
    player1_id,
    player2_id
):
    """
    Calculate Elo changes for a tournament match.
    Tournament matches are single-elimination,
    so a draw is not allowed.
    """
    player1_expected = expected_score(
        player1_rating,
        player2_rating
    )
    player2_expected = expected_score(
        player2_rating,
        player1_rating
    )
    if winner_id == player1_id:
        player1_actual = 1
        player2_actual = 0
    elif winner_id == player2_id:
        player1_actual = 0
        player2_actual = 1
    else:
        raise ValueError(
            "Invalid tournament winner"
        )
    player1_new_rating = round(
        player1_rating +
        K_FACTOR * (
            player1_actual -
            player1_expected
        )
    )
    player2_new_rating = round(
        player2_rating +
        K_FACTOR * (
            player2_actual -
            player2_expected
        )
    )
    return {
        "player1_old_rating":
            player1_rating,
        "player2_old_rating":
            player2_rating,
        "player1_new_rating":
            player1_new_rating,
        "player2_new_rating":
            player2_new_rating,
        "player1_change":
            player1_new_rating -
            player1_rating,
        "player2_change":
            player2_new_rating -
            player2_rating
    }
