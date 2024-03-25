import { StaticPlantData } from "src/interfaces/plant";
import { SeedData, ToolData } from "src/interfaces/seed";

export var seedData: Array<SeedData> = [
    {id: "A", icon: "red_seed.png", color: "#caa"},
    {id: "B", icon: "blue_seed.png", color: "#aac"},
    {id: "C", icon: "green_seed.png", color: "#aca"},
    {id: "D", icon: "yellow_seed.png", color: "#cca"},
  ]

export var staticPlantData: Array<StaticPlantData> = [
    {id: "A1", name: "Silly Lilly", spriteIndex: 0, family: "Lillies", patternSize: 1, patternSeeds: "A", resultSeeds: {"A": 1, "B": 1}},
    {id: "A2", name: "Silly Dilly", spriteIndex: 1, family: "Dillies", patternSize: 1, patternSeeds: "B", resultSeeds: {"A": 2}},
    {id: "B1", name: "Silly Lilly 2", spriteIndex: 2, family: "Lillies", patternSize: 2, patternSeeds: "AB", resultSeeds: {"A": 2, "B": 1, "C": 1}},
    {id: "B2", name: "Silly Dilly 2", spriteIndex: 3, family: "Dillies", patternSize: 2, patternSeeds: "AC", resultSeeds: {"A": 1, "B": 3}},
    {id: "B3", name: "Silly Billy 2", spriteIndex: 4, family: "Billies", patternSize: 3, patternSeeds: "BC", resultSeeds: {"B": 2, "C": 2}},
    {id: "C1", name: "Silly Lilly 3", spriteIndex: 5, family: "Lillies", patternSize: 3, patternSeeds: "ABC", resultSeeds: {"A": 2, "B": 2, "C": 2}},
    {id: "C2", name: "Silly Dilly 3", spriteIndex: 6, family: "Dillies", patternSize: 4, patternSeeds: "ABC", resultSeeds: {"A": 2, "B": 2, "C": 3, "D": 1}},
    {id: "D1", name: "Silly Lilly 4", spriteIndex: 7, family: "Lillies", patternSize: 4, patternSeeds: "ABCD", resultSeeds: {"A": 3, "B": 3, "C": 2}},
]

export var toolData: Array<ToolData> = [
  {id: 0, name: "Hoe", iconIndex: 4},
  {id: 1, name: "Shovel", iconIndex: 10},
  {id: 2, name: "Watering Can", iconIndex: 16},
  {id: 3, name: "Scythe", iconIndex: 3},
]