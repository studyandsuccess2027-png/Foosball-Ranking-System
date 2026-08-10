from datetime import datetime

from app.extensions import db

class MatchInvitation(db.Model):

    __tablename__ = "match_invitations"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    sender_id = db.Column(
        db.Integer,
        db.ForeignKey("players.id"),
        nullable=False
    )

    receiver_id = db.Column(
        db.Integer,
        db.ForeignKey("players.id"),
        nullable=False
    )

    scheduled_at = db.Column(
        db.DateTime,
        nullable=True
    )

    duration_minutes = db.Column(
        db.Integer,
        nullable=True
    )

    location = db.Column(
        db.String(255),
        nullable=True
    )

    message = db.Column(
        db.Text,
        nullable=True
    )

    status = db.Column(
        db.String(30),
        nullable=False,
        default="pending"
    )

    scheduled_match_id = db.Column(
        db.Integer,
        db.ForeignKey("scheduled_matches.id"),
        nullable=True
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    responded_at = db.Column(
        db.DateTime,
        nullable=True
    )

    sender = db.relationship(
        "Player",
        foreign_keys=[sender_id]
    )

    receiver = db.relationship(
        "Player",
        foreign_keys=[receiver_id]
    )

    scheduled_match = db.relationship(
        "ScheduledMatch",
        foreign_keys=[scheduled_match_id]
    )

    def to_dict(self):

        return {

            "id": self.id,

            "sender_id":
                self.sender_id,

            "receiver_id":
                self.receiver_id,

            "scheduled_at": (
                self.scheduled_at.isoformat()
                if self.scheduled_at
                else None
            ),

            "duration_minutes":
                self.duration_minutes,

            "location":
                self.location,

            "message":
                self.message,

            "status":
                self.status,

            "scheduled_match_id":
                self.scheduled_match_id,

            "created_at": (
                self.created_at.isoformat()
                if self.created_at
                else None
            ),

            "responded_at": (
                self.responded_at.isoformat()
                if self.responded_at
                else None
            ),

            "sender": {

                "id": self.sender.id,

                "username": self.sender.username,

                "full_name": self.sender.full_name

            } if self.sender else None,

            "receiver": {

                "id": self.receiver.id,

                "username": self.receiver.username,

                "full_name": self.receiver.full_name

            } if self.receiver else None

        }


class Notification(db.Model):

    __tablename__ = "notifications"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    player_id = db.Column(
        db.Integer,
        db.ForeignKey("players.id"),
        nullable=False
    )

    type = db.Column(
        db.String(50),
        nullable=False
    )

    title = db.Column(
        db.String(150),
        nullable=False
    )

    message = db.Column(
        db.Text,
        nullable=False
    )

    related_id = db.Column(
        db.Integer,
        nullable=True
    )

    is_read = db.Column(
        db.Boolean,
        default=False,
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    player = db.relationship(
        "Player",
        backref="notifications"
    )

    def to_dict(self):

        return {

            "id":
                self.id,

            "player_id":
                self.player_id,

            "type":
                self.type,

            "title":
                self.title,

            "message":
                self.message,

            "related_id":
                self.related_id,

            "is_read":
                self.is_read,

            "created_at": (
                self.created_at.isoformat()
                if self.created_at
                else None
            )

        }