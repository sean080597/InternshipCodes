export class SuccessResponse<T> {
  code: string;
  succeeded: boolean;
  message: string;
  errors: string[];
  data: T;
  totalCount?: number;
}

export class FailResponse {
  error: {
    code: string;
    message: string;
    details: string;
    data: {
      additionalProp1: string;
      additionalProp2: string;
      additionalProp3: string;
    },
    validationErrors: {
      message: string;
      members: string[];
    }[];
  };
}

export class PaginationResponse<T> {
  totalCount: number;
  content: T[];
}
