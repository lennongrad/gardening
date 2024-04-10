import { Injectable } from '@angular/core';
import { AsyncAction } from 'rxjs/internal/scheduler/AsyncAction';
import { questData } from 'src/data/plants';
import { Quest, SaveableQuest } from 'src/interfaces/seed';
import { DebugService } from './debug.service';

@Injectable({
  providedIn: 'root'
})
export class QuestService {
  acquiredAchivements: Array<string> = []

  quests: Array<Quest> = [];

  constructor(private debugService: DebugService) { 
  }

  getFirstActiveQuest(onlyTutorial: boolean = false): Quest | null{
    var activeQuests = this.quests.filter(quest => quest.active && (onlyTutorial || quest.questData.isTutorial))
    if(activeQuests.length == 0){
      return null
    }
    return activeQuests[0]
  }

  getTutorialProgress(): number{
    for(var i = 0; i < 1000; i++){
      if(!this.acquiredAchivements.includes("T" + i.toString())){
        return i;
      }
    }
    return 1000;
  }

  onLoadSave(loadedAchievements: Array<string>, loadedQuests: Array<SaveableQuest>): boolean{
    this.acquiredAchivements = loadedAchievements
    
    questData.forEach(questData => {
      var matchingLoadedData = loadedQuests.filter(quest => quest.questDataID == questData.id)

      if(matchingLoadedData.length == 1){
        this.quests.push({
          questData: questData,
          seenTriggers: matchingLoadedData[0].seenTriggers,
          completed: matchingLoadedData[0].completed,
          active: matchingLoadedData[0].active
        })
      } else {
        this.quests.push({
          questData: questData,
          seenTriggers: [],
          completed: false,
          active: false
        })
      }
    })

    this.progressQuests()
    
    return true
  }

  onNoLoadSave(){
    var startingTutorial = this.debugService.getDebugSetting("startingTutorial")

    questData.forEach(quest => {
      var newQuest = {
        questData: quest,
        seenTriggers: [],
        completed: false,
        active: false
      }
      this.quests.push(newQuest)

      if(quest.isTutorial && (startingTutorial != null && quest.id < startingTutorial)){
        newQuest.completed = true
        this.acquiredAchivements.push(quest.rewardAchievement)
      }
    })
    this.progressQuests()
  }

  progressQuests(currentTrigger?: string){
    var completedQuests: Array<Quest> = []

    this.quests.filter(quest => !quest.active && !quest.completed).forEach(inactiveQuest => {
      if(inactiveQuest.questData.requiredAchievements.every(achievement => this.acquiredAchivements.includes(achievement))
       && (inactiveQuest.questData.requiredTrigger == undefined || inactiveQuest.questData.requiredTrigger == currentTrigger)
      && (this.getFirstActiveQuest(true) == null)){
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

  skipAllTutorials(){
    this.quests.forEach(quest => {
      if(quest.questData.isTutorial){
        quest.completed = true
        quest.active = false
        this.acquiredAchivements.push(quest.questData.rewardAchievement)
      }
    })
    this.progressQuests()
  }

  registerAchievement(achievement: string){
    if(!this.acquiredAchivements.includes(achievement)){
      console.log("Registered achievement: " + achievement)
      
      if(this.debugService.getDebugSetting("printQuestSteps")){
        this.acquiredAchivements.push(achievement)
      }
    }
    this.progressQuests()
  }

  registerTrigger(trigger: string){
    if(this.debugService.getDebugSetting("printQuestSteps")){
      console.log("Registered trigger: " + trigger)
    }
    this.quests.filter(quest => quest.active).forEach(activeQuest => {
      activeQuest.seenTriggers.push(trigger)
    })

    this.progressQuests(trigger)
  }
}
