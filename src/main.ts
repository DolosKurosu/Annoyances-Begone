// Register the mod

import { upgradeMod } from "isaacscript-common";

// (which will make it show up in the list of mods on the mod screen in the main menu)
const Mod = RegisterMod("Boss Rush Character Upgrades Version 3", 1);
const ModUpgraded = upgradeMod(Mod);
