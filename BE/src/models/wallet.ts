import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

@Table({
  tableName: "wallet",
  timestamps: false,
})
export class Wallet extends Model<Wallet> {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  declare id: string;

  @Column
  declare privateKey: string;

  @Column
  declare userName: string;

  @Column
  declare password: string;
}
