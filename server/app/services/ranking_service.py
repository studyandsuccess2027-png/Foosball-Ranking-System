from app.models.player import Player
from app.models.match import Match


# =========================================================
# RANKING TIER
# =========================================================

def get_ranking_tier(elo_rating):
    """
    Returns ranking tier based on Elo rating.
    """

    elo = elo_rating or 1000

    if elo >= 1800:
        return {
            "name": "Diamond",
            "min_elo": 1800
        }

    if elo >= 1600:
        return {
            "name": "Platinum",
            "min_elo": 1600
        }

    if elo >= 1400:
        return {
            "name": "Gold",
            "min_elo": 1400
        }

    if elo >= 1200:
        return {
            "name": "Silver",
            "min_elo": 1200
        }

    return {
        "name": "Bronze",
        "min_elo": 0
    }


# =========================================================
# PLAYER STREAK
# =========================================================

def get_player_streak(player_id):
    """
    Calculate current win/loss streak from completed matches.

    Returns:
        {
            "type": "win" / "loss" / "none",
            "count": number
        }
    """

    matches = Match.query.filter(
        (Match.player1_id == player_id) |
        (Match.player2_id == player_id)
    ).order_by(
        Match.created_at.desc(),
        Match.id.desc()
    ).all()

    if not matches:
        return {
            "type": "none",
            "count": 0
        }

    current_type = None
    count = 0

    for match in matches:

        # Draw does not continue a win/loss streak.
        if match.is_draw or match.winner_id is None:
            break

        if match.winner_id == player_id:
            result_type = "win"
        else:
            result_type = "loss"

        if current_type is None:
            current_type = result_type
            count = 1
            continue

        if result_type == current_type:
            count += 1
        else:
            break

    return {
        "type": current_type or "none",
        "count": count
    }


# =========================================================
# PLAYER RANKING DATA
# =========================================================

def get_player_ranking_data(player):
    """
    Build complete ranking information for a player.
    """

    tier = get_ranking_tier(
        player.elo_rating
    )

    streak = get_player_streak(
        player.id
    )

    matches = player.matches_played or 0
    wins = player.wins or 0
    losses = player.losses or 0

    if matches > 0:
        win_rate = round(
            (wins / matches) * 100,
            1
        )
    else:
        win_rate = 0

    return {
        "id": player.id,
        "username": player.username,
        "full_name": player.full_name,
        "city": player.city,
        "country": player.country,
        "avatar": player.avatar,

        "elo_rating": player.elo_rating or 1000,

        "matches_played": matches,
        "wins": wins,
        "losses": losses,

        "win_rate": win_rate,

        "tier": tier["name"],
        "tier_min_elo": tier["min_elo"],

        "streak_type": streak["type"],
        "streak_count": streak["count"]
    }


# =========================================================
# LEADERBOARD
# =========================================================

def get_leaderboard(
    search=None,
    tier=None,
    sort_by="elo",
    order="desc"
):
    """
    Returns leaderboard with filters and ranking information.
    """

    query = Player.query

    # -----------------------------------------------------
    # SEARCH
    # -----------------------------------------------------

    if search:
        search_text = f"%{search.strip()}%"

        query = query.filter(
            db_or(
                Player.username.ilike(search_text),
                Player.full_name.ilike(search_text),
                Player.city.ilike(search_text)
            )
        )

    players = query.all()

    # -----------------------------------------------------
    # ADD RANKING DATA
    # -----------------------------------------------------

    result = []

    for player in players:

        data = get_player_ranking_data(player)

        # -------------------------------------------------
        # TIER FILTER
        # -------------------------------------------------

        if tier:
            if data["tier"].lower() != tier.lower():
                continue

        result.append(data)

    # -----------------------------------------------------
    # SORT
    # -----------------------------------------------------

    if sort_by == "wins":
        key_function = lambda x: x["wins"]

    elif sort_by == "win_rate":
        key_function = lambda x: x["win_rate"]

    elif sort_by == "matches":
        key_function = lambda x: x["matches_played"]

    elif sort_by == "streak":
        key_function = lambda x: x["streak_count"]

    else:
        key_function = lambda x: x["elo_rating"]

    result.sort(
        key=key_function,
        reverse=(order.lower() != "asc")
    )

    # -----------------------------------------------------
    # ASSIGN RANK
    # -----------------------------------------------------

    for index, player in enumerate(result):
        player["rank"] = index + 1

    return result


# =========================================================
# SMALL DB OR HELPER
# =========================================================

def db_or(*conditions):
    """
    Helper to avoid importing SQLAlchemy directly everywhere.
    """

    from app.extensions import db

    return db.or_(*conditions)