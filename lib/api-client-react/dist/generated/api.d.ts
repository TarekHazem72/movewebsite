import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type { Article, ArticleList, AuthResponse, Comment, CommentList, CreateArticleBody, CreateCommentBody, ErrorResponse, HealthStatus, ListArticlesParams, LoginBody, MessageResponse, RegisterBody, User, UserList } from "./api.schemas";
import { customFetch } from "../custom-fetch";
import type { ErrorType, BodyType } from "../custom-fetch";
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
/**
 * Returns server health status
 * @summary Health check
 */
export declare const getHealthCheckUrl: () => string;
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Register a new user
 */
export declare const getRegisterUrl: () => string;
export declare const register: (registerBody: RegisterBody, options?: RequestInit) => Promise<AuthResponse>;
export declare const getRegisterMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof register>>, TError, {
        data: BodyType<RegisterBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof register>>, TError, {
    data: BodyType<RegisterBody>;
}, TContext>;
export type RegisterMutationResult = NonNullable<Awaited<ReturnType<typeof register>>>;
export type RegisterMutationBody = BodyType<RegisterBody>;
export type RegisterMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Register a new user
 */
export declare const useRegister: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof register>>, TError, {
        data: BodyType<RegisterBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof register>>, TError, {
    data: BodyType<RegisterBody>;
}, TContext>;
/**
 * @summary Log in
 */
export declare const getLoginUrl: () => string;
export declare const login: (loginBody: LoginBody, options?: RequestInit) => Promise<AuthResponse>;
export declare const getLoginMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, {
        data: BodyType<LoginBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, {
    data: BodyType<LoginBody>;
}, TContext>;
export type LoginMutationResult = NonNullable<Awaited<ReturnType<typeof login>>>;
export type LoginMutationBody = BodyType<LoginBody>;
export type LoginMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Log in
 */
export declare const useLogin: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, {
        data: BodyType<LoginBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof login>>, TError, {
    data: BodyType<LoginBody>;
}, TContext>;
/**
 * @summary Log out
 */
export declare const getLogoutUrl: () => string;
export declare const logout: (options?: RequestInit) => Promise<MessageResponse>;
export declare const getLogoutMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof logout>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof logout>>, TError, void, TContext>;
export type LogoutMutationResult = NonNullable<Awaited<ReturnType<typeof logout>>>;
export type LogoutMutationError = ErrorType<unknown>;
/**
 * @summary Log out
 */
export declare const useLogout: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof logout>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof logout>>, TError, void, TContext>;
/**
 * @summary Get current logged-in user
 */
export declare const getGetMeUrl: () => string;
export declare const getMe: (options?: RequestInit) => Promise<User>;
export declare const getGetMeQueryKey: () => readonly ["/api/auth/me"];
export declare const getGetMeQueryOptions: <TData = Awaited<ReturnType<typeof getMe>>, TError = ErrorType<ErrorResponse>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetMeQueryResult = NonNullable<Awaited<ReturnType<typeof getMe>>>;
export type GetMeQueryError = ErrorType<ErrorResponse>;
/**
 * @summary Get current logged-in user
 */
export declare function useGetMe<TData = Awaited<ReturnType<typeof getMe>>, TError = ErrorType<ErrorResponse>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List all articles
 */
export declare const getListArticlesUrl: (params?: ListArticlesParams) => string;
export declare const listArticles: (params?: ListArticlesParams, options?: RequestInit) => Promise<ArticleList>;
export declare const getListArticlesQueryKey: (params?: ListArticlesParams) => readonly ["/api/articles", ...ListArticlesParams[]];
export declare const getListArticlesQueryOptions: <TData = Awaited<ReturnType<typeof listArticles>>, TError = ErrorType<unknown>>(params?: ListArticlesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listArticles>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listArticles>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListArticlesQueryResult = NonNullable<Awaited<ReturnType<typeof listArticles>>>;
export type ListArticlesQueryError = ErrorType<unknown>;
/**
 * @summary List all articles
 */
export declare function useListArticles<TData = Awaited<ReturnType<typeof listArticles>>, TError = ErrorType<unknown>>(params?: ListArticlesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listArticles>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a new article (poster role required)
 */
export declare const getCreateArticleUrl: () => string;
export declare const createArticle: (createArticleBody: CreateArticleBody, options?: RequestInit) => Promise<Article>;
export declare const getCreateArticleMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createArticle>>, TError, {
        data: BodyType<CreateArticleBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createArticle>>, TError, {
    data: BodyType<CreateArticleBody>;
}, TContext>;
export type CreateArticleMutationResult = NonNullable<Awaited<ReturnType<typeof createArticle>>>;
export type CreateArticleMutationBody = BodyType<CreateArticleBody>;
export type CreateArticleMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Create a new article (poster role required)
 */
export declare const useCreateArticle: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createArticle>>, TError, {
        data: BodyType<CreateArticleBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createArticle>>, TError, {
    data: BodyType<CreateArticleBody>;
}, TContext>;
/**
 * @summary Get a single article
 */
export declare const getGetArticleUrl: (id: number) => string;
export declare const getArticle: (id: number, options?: RequestInit) => Promise<Article>;
export declare const getGetArticleQueryKey: (id: number) => readonly [`/api/articles/${number}`];
export declare const getGetArticleQueryOptions: <TData = Awaited<ReturnType<typeof getArticle>>, TError = ErrorType<ErrorResponse>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getArticle>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getArticle>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetArticleQueryResult = NonNullable<Awaited<ReturnType<typeof getArticle>>>;
export type GetArticleQueryError = ErrorType<ErrorResponse>;
/**
 * @summary Get a single article
 */
export declare function useGetArticle<TData = Awaited<ReturnType<typeof getArticle>>, TError = ErrorType<ErrorResponse>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getArticle>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Delete an article (author only)
 */
export declare const getDeleteArticleUrl: (id: number) => string;
export declare const deleteArticle: (id: number, options?: RequestInit) => Promise<MessageResponse>;
export declare const getDeleteArticleMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteArticle>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteArticle>>, TError, {
    id: number;
}, TContext>;
export type DeleteArticleMutationResult = NonNullable<Awaited<ReturnType<typeof deleteArticle>>>;
export type DeleteArticleMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Delete an article (author only)
 */
export declare const useDeleteArticle: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteArticle>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteArticle>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary List comments for an article
 */
export declare const getListCommentsUrl: (id: number) => string;
export declare const listComments: (id: number, options?: RequestInit) => Promise<CommentList>;
export declare const getListCommentsQueryKey: (id: number) => readonly [`/api/articles/${number}/comments`];
export declare const getListCommentsQueryOptions: <TData = Awaited<ReturnType<typeof listComments>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listComments>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listComments>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListCommentsQueryResult = NonNullable<Awaited<ReturnType<typeof listComments>>>;
export type ListCommentsQueryError = ErrorType<unknown>;
/**
 * @summary List comments for an article
 */
export declare function useListComments<TData = Awaited<ReturnType<typeof listComments>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listComments>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Post a comment on an article (login required)
 */
export declare const getCreateCommentUrl: (id: number) => string;
export declare const createComment: (id: number, createCommentBody: CreateCommentBody, options?: RequestInit) => Promise<Comment>;
export declare const getCreateCommentMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createComment>>, TError, {
        id: number;
        data: BodyType<CreateCommentBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createComment>>, TError, {
    id: number;
    data: BodyType<CreateCommentBody>;
}, TContext>;
export type CreateCommentMutationResult = NonNullable<Awaited<ReturnType<typeof createComment>>>;
export type CreateCommentMutationBody = BodyType<CreateCommentBody>;
export type CreateCommentMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Post a comment on an article (login required)
 */
export declare const useCreateComment: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createComment>>, TError, {
        id: number;
        data: BodyType<CreateCommentBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createComment>>, TError, {
    id: number;
    data: BodyType<CreateCommentBody>;
}, TContext>;
/**
 * @summary Delete a comment (author only)
 */
export declare const getDeleteCommentUrl: (id: number) => string;
export declare const deleteComment: (id: number, options?: RequestInit) => Promise<MessageResponse>;
export declare const getDeleteCommentMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteComment>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteComment>>, TError, {
    id: number;
}, TContext>;
export type DeleteCommentMutationResult = NonNullable<Awaited<ReturnType<typeof deleteComment>>>;
export type DeleteCommentMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Delete a comment (author only)
 */
export declare const useDeleteComment: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteComment>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteComment>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary List all users (public)
 */
export declare const getListUsersUrl: () => string;
export declare const listUsers: (options?: RequestInit) => Promise<UserList>;
export declare const getListUsersQueryKey: () => readonly ["/api/users"];
export declare const getListUsersQueryOptions: <TData = Awaited<ReturnType<typeof listUsers>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listUsers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listUsers>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListUsersQueryResult = NonNullable<Awaited<ReturnType<typeof listUsers>>>;
export type ListUsersQueryError = ErrorType<unknown>;
/**
 * @summary List all users (public)
 */
export declare function useListUsers<TData = Awaited<ReturnType<typeof listUsers>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listUsers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export {};
//# sourceMappingURL=api.d.ts.map