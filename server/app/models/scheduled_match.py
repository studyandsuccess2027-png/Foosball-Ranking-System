from datetime import datetime

from app.extensions import db

class ScheduledMatch(db.Model):

    __tablename__ = "scheduled_matches"

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

    scheduled_at = db.Column(
        db.DateTime,
        nullable=False
    )

    duration_minutes = db.Column(
        db.Integer,
        nullable=True
    )

    location = db.Column(
        db.String(255),
        nullable=True
    )

    notes = db.Column(
        db.Text,
        nullable=True
    )

    status = db.Column(
        db.String(30),
        nullable=False,
        default="scheduled"
    )

    created_by = db.Column(
        db.Integer,
        db.ForeignKey("players.id"),
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    player1 = db.relationship(
        "Player",
        foreign_keys=[player1_id]
    )

    player2 = db.relationship(
        "Player",
        foreign_keys=[player2_id]
    )

    creator = db.relationship(
        "Player",
        foreign_keys=[created_by]
    )

    def to_dict(self):

        return {

            "id": self.id,

            "player1_id": self.player1_id,

            "player2_id": self.player2_id,

            "scheduled_at": (
                self.scheduled_at.isoformat()
                if self.scheduled_at
                else None
            ),

            "duration_minutes":
                self.duration_minutes,

            "location":
                self.location,

            "notes":
                self.notes,

            "status":
                self.status,

            "created_by":
                self.created_by,

            "created_at": (
                self.created_at.isoformat()
                if self.created_at
                else None
            ),

            "updated_at": (
                self.updated_at.isoformat()
                if self.updated_at
                else None
            ),

            "player1": {

                "id": self.player1.id,

                "username": self.player1.username,

                "full_name": self.player1.full_name

            } if self.player1 else None,

            "player2": {

                "id": self.player2.id,

                "username": self.player2.username,

                "full_name": self.player2.full_name

            } if self.player2 else None

        }