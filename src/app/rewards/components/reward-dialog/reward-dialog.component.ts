import { Component, inject, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { ScoreService } from '../../services/score.service';
import { CodeService } from '../../services/code.service';
import { RewardService } from '../../services/reward.service';
import { switchMap } from 'rxjs';

@Component({
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIcon],
  selector: 'app-reward-dialog',
  templateUrl: './reward-dialog.component.html',
  styleUrl: './reward-dialog.component.css',
})
export class ConfirmationDialog {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  scoreService = inject(ScoreService);
  codeService = inject(CodeService);
  rewardService = inject(RewardService);

  code = '';

  chargeReward() {
    this.scoreService
      .update(this.data.score.id, {
        ...this.data.score,
        remainingPoints: this.data.remainingPoints,
      })
      .pipe(
        switchMap(() =>
          this.codeService.getByQuery({
            rewardId: this.data.reward.id,
          })
        ),
        switchMap((codes) => {
          const code = codes[0];
          this.code = code.code;
          return this.codeService
            .update(code.id, {
              ...code,
              isRedeemed: true,
            })
            .pipe(
              switchMap(() =>
                this.rewardService.update(code.rewardId, {
                  ...this.data.reward,
                  codesAvailable: this.data.reward.codesAvailable - 1,
                })
              )
            );
        })
      )
      .subscribe(() => {
        this.data.updateTotalPoints(this.data.remainingPoints);
      });
  }
}
