// Utility
import { SetMetadata } from "@nestjs/common";

// Enum
import { ModuleEnum } from "../enums/modules.enums";

export const MODULE_KEY = "module";
export const ModuleSetMetadata = (module: ModuleEnum[]) => SetMetadata(MODULE_KEY, module);
