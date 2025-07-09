import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialog } from '../../components/reward-dialog/reward-dialog.component';
import { Reward } from '../../model/reward.entity';
import { RewardService } from '../../services/reward.service';
import { ScoreService } from '../../services/score.service';
import { UserClient } from '../../../shared/services/user-client.service';
import { Score } from '../../model/score.entity';
import { ActivityFacadeService } from '../../../shared/services/activity-facade.service';
import { ActivityReward } from '../../model/activity-reward.entity';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rewards',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatDialogModule],
  templateUrl: './rewards.component.html',
  styleUrls: ['./rewards.component.css'],
})
export class RewardsComponent implements OnInit {
  rewards: Reward[] = [];

  totalPoints = 0;
  score: Score | null = null;
  activities: ActivityReward[] = []; // Adjust type as needed

  constructor() {}

  dialog = inject(MatDialog);
  rewardService = inject(RewardService);
  scoreService = inject(ScoreService);
  userClient = inject(UserClient);
  activityFacadeService = inject(ActivityFacadeService);
  router = inject(Router);

  ngOnInit(): void {
    this.rewardService.getRewards().subscribe((rewards) => {
      this.rewards = rewards;
    });

    this.scoreService
      .getScoreByUserId(5)
      .subscribe((score) => {
        this.totalPoints = score.points;
        this.score = score;
      });

    this.activityFacadeService
      .getActivityByUserId(5)
      .subscribe((activities) => {
        if (activities.length > 0) {
          this.activities = activities.map(
            (activity) =>
              new ActivityReward({
                id: activity.id,
                description: activity.description,
                points: activity.points,
              })
          );
        }
      });
  }

  updateTotalPoints(points: number): void {
    this.totalPoints = points;
  }

  viewAllActivities(): void {
    // TODO: Update path to the correct activities page
    this.router.navigate(['/activities']);
  }

  openConfirmationDialog(reward: Reward): void {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        reward,
        score: this.score,
        remainingPoints: this.totalPoints - reward.pointsRequired,
        updateTotalPoints: this.updateTotalPoints.bind(this),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.totalPoints -= reward.pointsRequired;
        alert('¡Canjeado con éxito!');
      }
    });
  }
}
