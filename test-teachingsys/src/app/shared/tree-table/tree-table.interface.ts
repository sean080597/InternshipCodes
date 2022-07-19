export interface TreeTableInterface {
    key: string;
    title: string;
    description?: any;
    created?: any;
    updated?: any;
    author?: any;
    level?: number;
    expand?: boolean;
    children?: TreeTableInterface[];
    parent?: TreeTableInterface;
    activities?: TreeTableInterface[]
}

export interface TableField {
    header: string;
    fieldName: string;
    isFilter?: boolean;
    isSort?: boolean;
    compare?: any,
    priority?: any

}