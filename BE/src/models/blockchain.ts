import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

@Table({
  tableName: "chain",
  timestamps: false,
})
export class Chain extends Model<Chain> {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  declare id: string;

  @Column(DataType.JSONB)
  declare blockchain: object;
}
