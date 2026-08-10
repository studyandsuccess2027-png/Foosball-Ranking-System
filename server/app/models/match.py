from app.extensions import db

class Match(db.Model):

    __tablename__ = "matches"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    player1_id = db.Column(
        db.Integer,
        db.ForeignKey("players.id"),
        nullable=False
    )

    player2_id = db.Column(
        db.Integer,
        db.ForeignKey("players.id"),
        nullable=False
    )

    player1_score = db.Column(
        db.Integer,
        nullable=False
    )

    player2_score = db.Column(
        db.Integer,
        nullable=False
    )

    winner_id = db.Column(
        db.Integer,
        db.ForeignKey("players.id"),
        nullable=True
    )

    is_draw = db.Column(
        db.Boolean,
        default=False
    )

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )

    # =====================================================
    # PLAYER RELATIONSHIPS
    # =====================================================

    player1 = db.relationship(
        "Player",
        foreign_keys=[player1_id],
        backref="matches_as_player1"
    )

    player2 = db.relationship(
        "Player",
        foreign_keys=[player2_id],
        backref="matches_as_player2"
    )

    winner = db.relationship(
        "Player",
        foreign_keys=[winner_id],
        backref="matches_won"
    )

    # =====================================================
    # SERIALIZATION
    # =====================================================

    def to_dict(self):

        return {
            "id": self.id,

            "player1_id": self.player1_id,

            "player2_id": self.player2_id,

            "player1_score": self.player1_score,

            "player2_score": self.player2_score,

            "winner_id": self.winner_id,

            "is_draw": self.is_draw,

            "created_at": (
                self.created_at.isoformat()
                if self.created_at
                else None
            )
        }