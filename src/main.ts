/* eslint-disable prefer-const */
import { ModCallbacksCustom, upgradeMod } from "isaacscript-common";

const mod = RegisterMod("Annoyances Begone", 1);
const modUpgraded = upgradeMod(mod);

const game = Game();

function OnUpdate() {
  let player = Isaac.GetPlayer();
  let ptype = player.GetPlayerType();
  for (const entity of Isaac.GetRoomEntities()) {
    const data = entity.GetData();
    if (entity !== null) {
      if (
        entity.Type === EntityType.ENTITY_PICKUP &&
        entity.Variant === PickupVariant.PICKUP_COIN &&
        entity.SubType === CoinSubType.COIN_STICKYNICKEL
      ) {
        const coin = entity.ToPickup();
        if (coin !== null) {
          coin.Morph(
            EntityType.ENTITY_PICKUP,
            PickupVariant.PICKUP_COIN,
            CoinSubType.COIN_NICKEL,
            false,
            false,
            false,
          );
        }
      }
      if (
        entity.Type === EntityType.ENTITY_PICKUP &&
        entity.Variant === PickupVariant.PICKUP_HEART &&
        entity.SubType === HeartSubType.HEART_SCARED
      ) {
        const heart = entity.ToPickup();
        if (heart !== null) {
          heart.Morph(
            EntityType.ENTITY_PICKUP,
            PickupVariant.PICKUP_HEART,
            HeartSubType.HEART_HALF_SOUL,
            false,
            false,
            false,
          );
        }
      }
      if (
        entity.Type === EntityType.ENTITY_PICKUP &&
        entity.Variant === PickupVariant.PICKUP_TAROTCARD &&
        entity.SubType === Card.CARD_RULES
      ) {
        const card = entity.ToPickup();
        if (card !== null) {
          card.Morph(
            EntityType.ENTITY_PICKUP,
            PickupVariant.PICKUP_TAROTCARD,
            math.random(1, 31),
            false,
            false,
            false,
          );
        }
      }
      if (entity.IsActiveEnemy(false)) {
        const enemy = entity.ToNPC();
        if (enemy !== null) {
          if (
            entity.Type === EntityType.ENTITY_SUCKER &&
            entity.Variant === 5
          ) {
            enemy.Morph(EntityType.ENTITY_SUCKER, 0, 0, -1);
          } else if (entity.Type === EntityType.ENTITY_GRUDGE) {
            let x = entity.Velocity.X;
            let y = entity.Velocity.Y;
            x *= 19 / 20;
            y *= 17 / 20;
            entity.Velocity = Vector(x, y);
          }
        }
      }
    }
  }
}
mod.AddCallback(ModCallbacks.MC_POST_UPDATE, OnUpdate);

function NoSpiky(
  entityType: number,
  variant: number,
  subtype: number,
): void | [number, number, number] {
  if (entityType !== null) {
    if (entityType === 1010) {
      entityType = 1000;
      // 1010 means spiky rocks
      return [entityType, variant, subtype];
    }
  }
}
mod.AddCallback(ModCallbacks.MC_PRE_ROOM_ENTITY_SPAWN, NoSpiky);

function postGridEntityInit(gridEntity: GridEntity) {
  const gridEntityType = gridEntity.GetType();
  if (gridEntityType !== GridEntityType.GRID_ROCK_SPIKED) {
    return;
  }
  const room = game.GetRoom();
  const gridIndex = gridEntity.GetGridIndex();
  room.RemoveGridEntity(gridIndex, 0, false);
  room.Update();
}
modUpgraded.AddCallbackCustom(
  ModCallbacksCustom.MC_POST_GRID_ENTITY_INIT,
  postGridEntityInit,
);
