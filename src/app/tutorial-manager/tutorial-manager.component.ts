import { Component, OnInit } from '@angular/core';
import { QuestService } from '../quest.service';
import { Quest } from 'src/interfaces/seed';

@Component({
  selector: 'app-tutorial-manager',
  templateUrl: './tutorial-manager.component.html',
  styleUrls: ['./tutorial-manager.component.less']
})
export class TutorialManagerComponent implements OnInit {

  constructor(private questService: QuestService) { }

  getQuestStyle(): Record<string, any>{
    var activeQuest: Quest | null = this.questService.getFirstActiveQuest(true)
    if(activeQuest == null){
      return {display: "none"}
    }

    var baseStyle = activeQuest.questData.transform
    return baseStyle
  }

  getQuestText(): string{
    var activeQuest: Quest | null = this.questService.getFirstActiveQuest(true)
    if(activeQuest == null){
      return ""
    }
    return activeQuest.questData.text
  }

  ngOnInit(): void {
  }

}
