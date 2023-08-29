import { Permission } from "../permission/permission.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from "typeorm";

@Entity("roles")
export class Role {
  @PrimaryColumn()
  id?: number;

  @Column({unique: true})
  name?: string;

  @ManyToMany(() => Permission, {cascade: true})
  @JoinTable({
    name: "role_permissions",
    joinColumn: { name: "role_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "permission_id", referencedColumnName: "id" }
  })
  permissions?: Permission[];
}