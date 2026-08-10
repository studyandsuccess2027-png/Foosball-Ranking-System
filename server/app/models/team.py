from datetime import datetime

from app import db

class Team(db.Model):

    __tablename__ = "teams"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    name = db.Column(
        db.String(100),
        nullable=False,
        unique=True
    )

    description = db.Column(
        db.String(500),
        nullable=True
    )

    city = db.Column(
        db.String(100),
        nullable=True
    )

    owner_id = db.Column(
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

    owner = db.relationship(
        "Player",
        foreign_keys=[owner_id],
        backref="owned_teams"
    )

    members = db.relationship(
        "TeamMember",
        back_populates="team",
        cascade="all, delete-orphan"
    )

    def to_dict(self):

        return {

            "id": self.id,

            "name": self.name,

            "description": self.description,

            "city": self.city,

            "owner_id": self.owner_id,

            "created_at": (
                self.created_at.isoformat()
                if self.created_at
                else None
            )

        }


class TeamMember(db.Model):

    __tablename__ = "team_members"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    team_id = db.Column(
        db.Integer,
        db.ForeignKey("teams.id"),
        nullable=False
    )

    player_id = db.Column(
        db.Integer,
        db.ForeignKey("players.id"),
        nullable=False
    )

    role = db.Column(
        db.String(30),
        default="member",
        nullable=False
    )

    joined_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    team = db.relationship(
        "Team",
        back_populates="members"
    )

    player = db.relationship(
        "Player",
        backref="team_memberships"
    )

    __table_args__ = (
        db.UniqueConstraint(
            "team_id",
            "player_id",
            name="unique_team_player"
        ),
    )

    def to_dict(self):

        return {

            "id": self.id,

            "team_id": self.team_id,

            "player_id": self.player_id,

            "role": self.role,

            "joined_at": (
                self.joined_at.isoformat()
                if self.joined_at
                else None
            ),

            "player": {

                "id": self.player.id,

                "username": self.player.username,

                "full_name": self.player.full_name

            } if self.player else None

        }