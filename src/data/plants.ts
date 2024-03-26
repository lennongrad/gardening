import { StaticPlantData } from "src/interfaces/plant";
import { SeedData, ToolData, ToolLevel } from "src/interfaces/seed";

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