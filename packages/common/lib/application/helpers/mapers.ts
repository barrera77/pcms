export abstract class BaseMapper<Entity, Dto> {
  abstract toDto(entity: Entity): Dto;

  toDtoList(entities: Entity[]): Dto[] {
    return entities.map((entity) => this.toDto(entity));
  }

  protected objectIdToString(id: any): string {
    return id?.toString() || "";
  }
}
