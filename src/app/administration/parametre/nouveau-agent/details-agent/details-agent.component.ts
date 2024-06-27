import { Component, Input } from '@angular/core';
import { cloneDeep } from 'lodash';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { IAgent, Agent } from 'src/app/shared/model/agent.model';

@Component({
  selector: 'app-details-agent',
  templateUrl: './details-agent.component.html',
  styleUrls: ['./details-agent.component.scss']
})
export class DetailsAgentComponent {

  agent: IAgent = new Agent();
  @Input() data: IAgent = new Agent();

  constructor(
    private dialogRef: DynamicDialogRef,
    private dynamicDialog:  DynamicDialogConfig,
) {}

  ngOnInit(): void {
    if (this.dynamicDialog.data) {
      this.agent = cloneDeep(this.dynamicDialog.data);
    }
    }

    clear(): void {
      this.dialogRef.close();
      this.dialogRef.destroy();
  }

}
