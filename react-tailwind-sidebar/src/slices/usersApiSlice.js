import { USERS_URL, FEEDBACK_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      // Sending data to auth endpoint
      query: (data) => ({
        url: `${USERS_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    verify: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/verify`,
        method: "POST",
        body: data,
      }),
    }),
    sendRecoveryEmail: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/sendMail`,
        method: "POST",
        body: data,
      }),
    }),
    updatePassword: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/updatepw`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),
    createFeedback: builder.mutation({
      query: (data) => ({
        url: `${FEEDBACK_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    getAllFeedbacks: builder.query({
      query: () => ({
        url: `${FEEDBACK_URL}`,
        method: "GET",
      }),
    }),
    replyFeedback: builder.mutation({
      query: (data) => ({
        url: `${FEEDBACK_URL}/reply`,
        method: "POST",
        body: data,
      }),
    }),
    getUsers: builder.query({
      query: () => ({
        url: `${USERS_URL}`,
        method: "GET",
      }),
    }),
    getUserByName: builder.query({
      query: (username) => ({
        url: `${USERS_URL}/${username}`,
        method: "GET",
      }),
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
        method: "DELETE",
      }),
    }),
    addMechanic: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/mecha`,
        method: "POST",
        body: data,
      }),
    }),
    getMechanics: builder.query({
      query: () => ({
        url: `${USERS_URL}/mecha`,
        method: "GET",
      }),
    }),
    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `${USERS_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useVerifyMutation,
  useSendRecoveryEmailMutation,
  useUpdatePasswordMutation,
  useCreateFeedbackMutation,
  useLazyGetUserByNameQuery,
  useGetUsersQuery,
  useGetAllFeedbacksQuery,
  useReplyFeedbackMutation,
  useDeleteUserMutation,
  useGetMechanicsQuery,
  useAddMechanicMutation,
  useUpdateUserMutation,
} = usersApiSlice;
