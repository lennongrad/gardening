import { StaticPlantData } from "src/interfaces/plant";
import { SeedData } from "src/interfaces/seed";

export var seedData: Array<SeedData> = [
    {id: "A", icon: "red_seed.png", color: "#caa"},
    {id: "B", icon: "blue_seed.png", color: "#aac"},
    {id: "C", icon: "green_seed.png", color: "#aca"},
    {id: "D", icon: "yellow_seed.png", color: "#cca"},
  ]

export var staticPlantData: Array<StaticPlantData> = [
    {id: "A1", name: "Silly Lilly", patternSize: 1, patternSeeds: "A", resultSeeds: {"A": 1, "B": 1}},
    {id: "A2", name: "Silly Dilly", patternSize: 1, patternSeeds: "B", resultSeeds: {"A": 2}},
    {id: "B1", name: "Silly Lilly 2", patternSize: 2, patternSeeds: "AB", resultSeeds: {"A": 2, "B": 1, "C": 1}},
    {id: "B2", name: "Silly Dilly 2", patternSize: 2, patternSeeds: "AC", resultSeeds: {"A": 1, "B": 3}},
    {id: "B3", name: "Silly Billy 2", patternSize: 3, patternSeeds: "BC", resultSeeds: {"B": 2, "C": 2}},
    {id: "C1", name: "Silly Lilly 3", patternSize: 3, patternSeeds: "ABC", resultSeeds: {"A": 2, "B": 2, "C": 2}},
    {id: "C2", name: "Silly Dilly 3", patternSize: 4, patternSeeds: "ABC", resultSeeds: {"A": 2, "B": 2, "C": 3, "D": 1}},
    {id: "D1", name: "Silly Lilly 4", patternSize: 4, patternSeeds: "ABCD", resultSeeds: {"A": 3, "B": 3, "C": 2}},
]