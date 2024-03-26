import { Injectable } from '@angular/core';
import { AsyncAction } from 'rxjs/internal/scheduler/AsyncAction';
import { questData } from 'src/data/plants';
import { Quest } from 'src/interfaces/seed';

@Injectable({
  providedIn: 'root'
})
export class QuestService {
  acquiredAchivements: Array<string> = []

  quests: Array<Quest> = [];

  constructor() { 
    this.initializeQuests()
  }

  getFirstActiveQuest(onlyTutorial: boolean = false): Quest | null{
    var activeQuests = this.quests.filter(quest => quest.active && (onlyTutorial || quest.questData.isTutorial))
    if(activeQuests.length == 0){
      return null
    }
    return activeQuests[0]
  }

  initializeQuests(){
    questData.forEach(quest => {
      this.quests.push({
        questData: quest,
        seenTriggers: [],
        completed: false,
        active: false
      })
    })
    this.progressQuests()
  }

  progressQuests(currentTrigger?: string){
    var completedQuests: Array<Quest> = []

    this.quests.filter(quest => !quest.active && !quest.completed).forEach(inactiveQuest => {
      if(inactiveQuest.questData.requiredAchievements.every(achievement => this.acquiredAchivements.includes(achievement))
       && (inactiveQuest.questData.requiredTrigger == undefined || inactiveQuest.questData.requiredTrigger == currentTrigger)){
        inactiveQuest.active = true
      }
    })

    this.quests.filter(quest => quest.active).forEach(activeQuest => {
      if(activeQuest.questData.completionAchievements.every(achievement => this.acquiredAchivements.includes(achievement))
        && activeQuest.questData.completionTriggers.every(trigger => activeQuest.seenTriggers.includes(trigger))){
        completedQuests.push(activeQuest)
        activeQuest.active = false
        activeQuest.completed = true
      }
    })

    if(completedQuests.length != 0){
      completedQuests.forEach(completedQuest => {this.acquiredAchivements.push(completedQuest.questData.rewardAchievement)})
      this.progressQuests()
    }
  }

  registerAchievement(achievement: string){
    console.log("Registered achievement: " + achievement)
    if(!(achievement in this.acquiredAchivements)){
      this.acquiredAchivements.push(achievement)
    }
    this.progressQuests()
  }

  registerTrigger(trigger: string){
    console.log("Registered trigger: " + trigger)
    this.quests.filter(quest => quest.active).forEach(activeQuest => {
      activeQuest.seenTriggers.push(trigger)
    })

    this.progressQuests(trigger)
  }
}
