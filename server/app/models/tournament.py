from datetime import datetime

from app import db

class Tournament(db.Model):

    __tablename__ = "tournaments"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    name = db.Column(
        db.String(150),
        nullable=False
    )

    description = db.Column(
        db.String(500),
        nullable=True
    )

    city = db.Column(
        db.String(100),
        nullable=True
    )

    format = db.Column(
        db.String(30),
        nullable=False,
        default="single_elimination"
    )

    status = db.Column(
        db.String(30),
        nullable=False,
        default="upcoming"
    )

    max_participants = db.Column(
        db.Integer,
        nullable=False,
        default=16
    )

    created_by = db.Column(
        db.Integer,
        db.ForeignKey("players.id"),
        nullable=False
    )

    # Tournament winner
    winner_id = db.Column(
        db.Integer,
        db.ForeignKey("players.id"),
        nullable=True
    )

    start_date = db.Column(
        db.DateTime,
        nullable=True
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    creator = db.relationship(
        "Player",
        foreign_keys=[created_by]
    )

    winner = db.relationship(
        "Player",
        foreign_keys=[winner_id]
    )

    participants = db.relationship(
        "TournamentParticipant",
        back_populates="tournament",
        cascade="all, delete-orphan"
    )

    matches = db.relationship(
        "TournamentMatch",
        back_populates="tournament",
        cascade="all, delete-orphan"
    )

    def to_dict(self):

        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "city": self.city,
            "format": self.format,
            "status": self.status,
            "max_participants": self.max_participants,
            "created_by": self.created_by,

            "winner_id": self.winner_id,

            "winner": {
                "id": self.winner.id,
                "username": self.winner.username,
                "full_name": self.winner.full_name
            } if self.winner else None,

            "start_date": (
                self.start_date.isoformat()
                if self.start_date
                else None
            ),

            "created_at": (
                self.created_at.isoformat()
                if self.created_at
                else None
            )
        }


class TournamentParticipant(db.Model):

    __tablename__ = "tournament_participants"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    tournament_id = db.Column(
        db.Integer,
        db.ForeignKey("tournaments.id"),
        nullable=False
    )

    player_id = db.Column(
        db.Integer,
        db.ForeignKey("players.id"),
        nullable=False
    )

    seed = db.Column(
        db.Integer,
        nullable=True
    )

    wins = db.Column(
        db.Integer,
        default=0
    )

    losses = db.Column(
        db.Integer,
        default=0
    )

    points = db.Column(
        db.Integer,
        default=0
    )

    eliminated = db.Column(
        db.Boolean,
        default=False
    )

    joined_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    tournament = db.relationship(
        "Tournament",
        back_populates="participants"
    )

    player = db.relationship(
        "Player"
    )

    __table_args__ = (
        db.UniqueConstraint(
            "tournament_id",
            "player_id",
            name="unique_tournament_player"
        ),
    )

    def to_dict(self):

        return {
            "id": self.id,
            "tournament_id": self.tournament_id,
            "player_id": self.player_id,
            "seed": self.seed,
            "wins": self.wins,
            "losses": self.losses,
            "points": self.points,
            "eliminated": self.eliminated,

            "player": {
                "id": self.player.id,
                "username": self.player.username,
                "full_name": self.player.full_name
            } if self.player else None
        }


class TournamentMatch(db.Model):

    __tablename__ = "tournament_matches"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    tournament_id = db.Column(
        db.Integer,
        db.ForeignKey("tournaments.id"),
        nullable=False
    )

    round_number = db.Column(
        db.Integer,
        nullable=False
    )

    match_number = db.Column(
        db.Integer,
        nullable=False
    )

    player1_id = db.Column(
        db.Integer,
        db.ForeignKey("players.id"),
        nullable=True
    )

    player2_id = db.Column(
        db.Integer,
        db.ForeignKey("players.id"),
        nullable=True
    )

    player1_score = db.Column(
        db.Integer,
        default=0
    )

    player2_score = db.Column(
        db.Integer,
        default=0
    )

    winner_id = db.Column(
        db.Integer,
        db.ForeignKey("players.id"),
        nullable=True
    )

    status = db.Column(
        db.String(30),
        default="scheduled"
    )

    # Match where this match's winner advances.
    next_match_id = db.Column(
        db.Integer,
        db.ForeignKey("tournament_matches.id"),
        nullable=True
    )

    # Slot in the next match receiving the winner.
    # Values: "player1" or "player2".
    next_slot = db.Column(
        db.String(10),
        nullable=True
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    tournament = db.relationship(
        "Tournament",
        back_populates="matches"
    )

    player1 = db.relationship(
        "Player",
        foreign_keys=[player1_id]
    )

    player2 = db.relationship(
        "Player",
        foreign_keys=[player2_id]
    )

    winner = db.relationship(
        "Player",
        foreign_keys=[winner_id]
    )

    next_match = db.relationship(
        "TournamentMatch",
        remote_side=[id],
        foreign_keys=[next_match_id],
        uselist=False
    )

    def to_dict(self):

        return {
            "id": self.id,
            "tournament_id": self.tournament_id,
            "round_number": self.round_number,
            "match_number": self.match_number,
            "player1_id": self.player1_id,
            "player2_id": self.player2_id,
            "player1_score": self.player1_score,
            "player2_score": self.player2_score,
            "winner_id": self.winner_id,
            "status": self.status,
            "next_match_id": self.next_match_id,
            "next_slot": self.next_slot,

            "player1": {
                "id": self.player1.id,
                "username": self.player1.username,
                "full_name": self.player1.full_name
            } if self.player1 else None,

            "player2": {
                "id": self.player2.id,
                "username": self.player2.username,
                "full_name": self.player2.full_name
            } if self.player2 else None,

            "winner": {
                "id": self.winner.id,
                "username": self.winner.username,
                "full_name": self.winner.full_name
            } if self.winner else None
        }