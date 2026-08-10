from flask import Blueprint, jsonify

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from app import db

from app.models.player import Player
from app.models.match import Match
from app.models.tournament import (
    TournamentParticipant
)


statistics_bp = Blueprint(
    "statistics",
    __name__,
    url_prefix="/api/statistics"
)


# =========================================================
# CURRENT PLAYER
# =========================================================

def get_current_player():

    user_id = get_jwt_identity()

    return Player.query.filter_by(
        user_id=user_id
    ).first()


# =========================================================
# PLAYER OVERALL STATISTICS
# =========================================================

@statistics_bp.route(
    "/me",
    methods=["GET"]
)
@jwt_required()
def my_statistics():

    player = get_current_player()

    if not player:

        return jsonify({
            "success": False,
            "message": "Player profile not found"
        }), 404

    # Matches where player participated
    matches = Match.query.filter(
        db.or_(
            Match.player1_id == player.id,
            Match.player2_id == player.id
        )
    ).all()

    total_matches = len(matches)

    wins = 0
    losses = 0
    draws = 0

    for match in matches:

        if match.winner_id is None:

            draws += 1

        elif match.winner_id == player.id:

            wins += 1

        else:

            losses += 1

    completed_matches = (
        wins +
        losses +
        draws
    )

    if completed_matches > 0:

        win_rate = round(
            (wins / completed_matches) * 100,
            2
        )

    else:

        win_rate = 0

    # Tournament statistics
    tournament_participations = (
        TournamentParticipant.query
        .filter_by(
            player_id=player.id
        )
        .all()
    )

    tournaments_played = len(
        tournament_participations
    )

    tournaments_won = 0

    for participation in tournament_participations:

        tournament = participation.tournament

        if not tournament:
            continue

        winner_match = None

        completed_matches = [
            match
            for match in tournament.matches
            if match.status == "completed"
        ]

        for match in completed_matches:

            if match.winner_id == player.id:

                winner_match = match

        # Player wins final = tournament winner
        if winner_match:

            highest_round = max(
                [
                    match.round_number
                    for match in tournament.matches
                ],
                default=0
            )

            if winner_match.round_number == highest_round:

                tournaments_won += 1

    return jsonify({

        "success": True,

        "statistics": {

            "total_matches":
                total_matches,

            "wins":
                wins,

            "losses":
                losses,

            "draws":
                draws,

            "win_rate":
                win_rate,

            "current_elo":
                player.elo_rating,

            "best_elo":
                player.elo_rating,

            "tournaments_played":
                tournaments_played,

            "tournaments_won":
                tournaments_won
        }

    }), 200


# =========================================================
# MATCH STATISTICS
# =========================================================

@statistics_bp.route(
    "/matches",
    methods=["GET"]
)
@jwt_required()
def match_statistics():

    player = get_current_player()

    if not player:

        return jsonify({
            "success": False,
            "message": "Player profile not found"
        }), 404

    matches = Match.query.filter(
        db.or_(
            Match.player1_id == player.id,
            Match.player2_id == player.id
        )
    ).order_by(
        Match.created_at.desc()
    ).all()

    result = []

    for match in matches:

        if match.winner_id == player.id:

            result_status = "win"

        elif match.winner_id is None:

            result_status = "draw"

        else:

            result_status = "loss"

        if match.player1_id == player.id:

            opponent = match.player2

            player_score = match.player1_score
            opponent_score = match.player2_score

        else:

            opponent = match.player1

            player_score = match.player2_score
            opponent_score = match.player1_score

        result.append({

            "match_id":
                match.id,

            "opponent": {

                "id":
                    opponent.id
                    if opponent else None,

                "username":
                    opponent.username
                    if opponent else None,

                "full_name":
                    opponent.full_name
                    if opponent else None

            },

            "player_score":
                player_score,

            "opponent_score":
                opponent_score,

            "result":
                result_status,

            "date":
                (
                    match.created_at.isoformat()
                    if match.created_at
                    else None
                )

        })

    return jsonify({

        "success": True,

        "matches":
            result

    }), 200


# =========================================================
# WIN / LOSS CHART DATA
# =========================================================

@statistics_bp.route(
    "/win-loss",
    methods=["GET"]
)
@jwt_required()
def win_loss_statistics():

    player = get_current_player()

    if not player:

        return jsonify({
            "success": False,
            "message": "Player profile not found"
        }), 404

    matches = Match.query.filter(
        db.or_(
            Match.player1_id == player.id,
            Match.player2_id == player.id
        )
    ).all()

    wins = 0
    losses = 0
    draws = 0

    for match in matches:

        if match.winner_id == player.id:

            wins += 1

        elif match.winner_id is None:

            draws += 1

        else:

            losses += 1

    return jsonify({

        "success": True,

        "data": {

            "wins": wins,

            "losses": losses,

            "draws": draws

        }

    }), 200


# =========================================================
# ELO HISTORY
# =========================================================

@statistics_bp.route(
    "/elo-history",
    methods=["GET"]
)
@jwt_required()
def elo_history():

    player = get_current_player()

    if not player:

        return jsonify({
            "success": False,
            "message": "Player profile not found"
        }), 404

    matches = Match.query.filter(
        db.or_(
            Match.player1_id == player.id,
            Match.player2_id == player.id
        )
    ).order_by(
        Match.created_at.asc()
    ).all()

    history = []

    current_elo = 1200

    for match in matches:

        if match.player1_id == player.id:

            elo_change = (
                match.player1_elo_change
                if hasattr(
                    match,
                    "player1_elo_change"
                )
                else 0
            )

        else:

            elo_change = (
                match.player2_elo_change
                if hasattr(
                    match,
                    "player2_elo_change"
                )
                else 0
            )

        current_elo += elo_change

        history.append({

            "match_id":
                match.id,

            "elo":
                current_elo,

            "elo_change":
                elo_change,

            "date":
                (
                    match.created_at.isoformat()
                    if match.created_at
                    else None
                )

        })

    return jsonify({

        "success": True,

        "history":
            history

    }), 200