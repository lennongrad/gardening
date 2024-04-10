import { StaticPlantData } from "src/interfaces/plant";
import { QuestData, SeedData, ToolData, ToolLevel } from "src/interfaces/seed";

export var seedData: Array<SeedData> = [
    {id: "A", icon: "red_seed.png", color: "#caa"},
    {id: "B", icon: "blue_seed.png", color: "#aac"},
    {id: "C", icon: "green_seed.png", color: "#aca"},
    {id: "D", icon: "yellow_seed.png", color: "#cca"},
  ]

export var toolData: Array<ToolData> = [
  {id: 0, name: "Hoe", iconIndex: 4},
  {id: 1, name: "Shovel", iconIndex: 10},
  {id: 2, name: "Pail", iconIndex: 16},
  {id: 3, name: "Scythe", iconIndex: 3},
  {id: 4, name: "Shears", iconIndex: 12},
]

export var toolLevels: Array<ToolLevel> = [
  {name: "Stone", iconIndex: 0, color1: "77858D", color2: "8DA8B8"},
  {name: "Copper", iconIndex: 2, color1: "885546", color2: "A5786A"},
  {name: "Bronze", iconIndex: 3, color1: "9E5439", color2: "F3AF63"},
  {name: "Iron", iconIndex: 1, color1: "858AAD", color2: "96B0C3"},
  {name: "Golden", iconIndex: 7, color1: "F89320", color2: "F9C22B"},
  {name: "Wetstone", iconIndex: 5, color1: "5287E7", color2: "69AFE5"},
  {name: "Galestone", iconIndex: 6, color1: "34844C", color2: "7FC14A"},
  {name: "Firestone", iconIndex: 4, color1: "FB6B1D", color2: "F9C22B"},
  {name: "Adamantium", iconIndex: 8, color1: "963893", color2: "E36DC9"},
]

var transformValues: Record<string, Record<string, any>> = {
    default: {},
    belowWindowSelector: {top: "65px", left:"10px", bottom: "unset", maxWidth: "350px"},
    middleOfScreen: {top: "300px", left:"430px", bottom: "unset"}
}

export var questData: Array<QuestData> = [
  {id: 0, isTutorial: true, requiredAchievements: [], completionAchievements: [], completionTriggers: ["clickHoe"], rewardAchievement: "T1",
     transform: transformValues["default"], 
     text: "Welcome! To start, click on the <b>Hoe</b> tool in the toolbar!", 
  },
  {id: 1, isTutorial: true, requiredAchievements: ["T1"], completionAchievements: [], completionTriggers: ["useHoe"], rewardAchievement: "T2",
      transform: transformValues["default"], 
      text: "Now, use the <b>Hoe</b> tool by clicking on a dirt space in the field.", 
  },
  {id: 2, isTutorial: true, requiredAchievements: ["T2"], completionAchievements: [], completionTriggers: ["clickDirt"], rewardAchievement: "T3",
      transform: transformValues["default"], 
      text: "Next, click on the <b>Shovel</b> tool and use it to start digging on the dirt space you made.", 
  },
  {id: 3, isTutorial: true, requiredAchievements: ["T3"], completionAchievements: [], completionTriggers: ["useShovel"], rewardAchievement: "T4",
      transform: transformValues["default"], 
      text: "Click on the <b>Red Seed</b> to fill in the seed pattern, then press <b>Plant</b>.", 
  },
  {id: 4, isTutorial: true, requiredAchievements: ["T4"], completionAchievements: [], completionTriggers: ["usePail"], rewardAchievement: "T5",
      transform: transformValues["default"], 
      text: "Click on the <b>Pail</b> tool and use it to water your new plant by clicking on it. Make sure to water it again soon!", 
  },
  {id: 5, isTutorial: true, requiredAchievements: ["T5"], requiredTrigger: "plantMaxxed", completionAchievements: [], completionTriggers: ["useScythe"], rewardAchievement: "T6",
      transform: transformValues["default"], 
      text: "Once the plant is done growing, use the <b>Scythe</b> tool to harvest the plant.<br> You will collect the resulting seeds automatically, plus precious experience points.", 
  },
  {id: 6, isTutorial: true, requiredAchievements: ["T6"], completionAchievements: [], completionTriggers: ["harvestPlantA2"], rewardAchievement: "T7",
      transform: transformValues["default"], 
      text: "Try using that new seed type you just discovered to plant a new type of flower!", 
  },
  {id: 7, isTutorial: true, requiredAchievements: ["T7"], requiredTrigger: "canAffordShovel", completionAchievements: [], completionTriggers: ["openStore"], rewardAchievement: "T8",
      transform: transformValues["belowWindowSelector"], 
      text: "Looks like you've got lots of experience points! Click the lightbulb icon to open the <b>Skills</b> page!", 
  },
  {id: 8, isTutorial: true, requiredAchievements: ["T8"], completionAchievements: ["shovelLevel2"], completionTriggers: [], rewardAchievement: "T9",
      transform: transformValues["middleOfScreen"], 
      text: "Click the <b>Shovel</b> to upgrade it to <b>Level 2</b>!<br>It'll use up 20 of your hard-earned experience points.", 
  },
  {id: 9, isTutorial: true, requiredAchievements: ["T9"], completionAchievements: [], completionTriggers: ["clickDirt"], rewardAchievement: "T10",
      transform: transformValues["default"], 
      text: "Try using your newly upgraded <b>Shovel</b> by planting a flower with a pattern that's two seeds long!", 
  },
  {id: 10, isTutorial: true, requiredAchievements: ["T10"], completionAchievements: [], completionTriggers: ["plantPattern2"], rewardAchievement: "T11",
      transform: transformValues["default"], 
      text: "Click the plus button to increase the number of seeds in your pattern, and the minus button to decrease them. Alternatively, try using the scroll wheel!", 
  },
  {id: 11, isTutorial: true, requiredAchievements: ["T11"], requiredTrigger: "showInviable", completionAchievements: [], completionTriggers: ["harvestInviable"], rewardAchievement: "T12",
      transform: transformValues["default"] ,
      text: "Looks like one of your plants was inviable! That happens when you plant a combination of seeds that doesn't correspond to an existing flower pattern. Don't let that discourage you from experimenting!", 
  },
  {id: 12, isTutorial: true, requiredAchievements: ["T11"], requiredTrigger: "showPattern2", completionAchievements: [], completionTriggers: ["harvestPlant"], rewardAchievement: "T13",
      transform:transformValues["default"], 
      text: "Good job! Plants with longer patterns take more time to grow, but they tend to give more seeds and experience points.", 
  },
  {id: 13, isTutorial: true, requiredAchievements: ["T12", "T13"], completionAchievements: [], completionTriggers: ["openAlmanac"], rewardAchievement: "T14",
      transform: transformValues["belowWindowSelector"], 
      text: "Now that you've tried lots of combinations, try clicking the book icon to open the <b>Almanac</b. page!!", 
  },
  {id: 14, isTutorial: true, requiredAchievements: ["T14"], completionAchievements: [], completionTriggers: ["clickAlmanacPlantUndiscovered"], rewardAchievement: "T15",
      transform: transformValues["middleOfScreen"], 
      text: "Now, click on the name of a plant whose pattern you haven't discovered to open up its research page.", 
  },
  {id: 15, isTutorial: true, requiredAchievements: ["T15"], completionAchievements: [], completionTriggers: ["clickShovel"], rewardAchievement: "T16",
      transform: transformValues["middleOfScreen"], 
      text: "If you harvest a viable plant, you will automatically use it to progress research towards your most recently selected, undiscovered plant in the <b>Almanac</b>.<br>Try it now!", 
  },
  {id: 16, isTutorial: true, requiredAchievements: ["T16"], requiredTrigger: "researchPlant", completionAchievements: [], completionTriggers: ["closeAlmanac"], rewardAchievement: "T17",
      transform: transformValues["default"], 
      text: "Now you should see the researched pattern in the <b>Almanac</b>! Hover over the tooltip for more information on how to understand each research result.<br>Close the <b>Almanac</b> when you're done.", 
  },
  {id: 17, isTutorial: true, requiredAchievements: ["T17"], completionAchievements: [], completionTriggers: ["useShears"], rewardAchievement: "T18",
      transform: transformValues["default"], 
      text: "Try using the <b>Shears</b> to sell a plant for cash! <i>Note</i>: When you do this, you won't receive experience or seeds.", 
  },

  // inviable message!
]


/*{id: 1, isTutorial: true, requiredAchievements: ["T1"], completionAchievements: [], completionTriggers: ["useHoe"], rewardAchievement: "T2",
transform: {}, 
text: "Now, use the <b>Hoe</b> tool by clicking on a dirt space in the field.", 
},*/