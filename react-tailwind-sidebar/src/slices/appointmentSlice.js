import { apiSlice } from "./apiSlice";
import { APPOINMENT_URL } from "../constants";

export const appointmentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    makeAppointment: builder.mutation({
      query: (appointmentData) => ({
        url: `${APPOINMENT_URL}`,
        method: "POST",
        body: appointmentData,
      }),
    }),
    viewAppointments: builder.query({
      query: (vin) => ({
        url: `${APPOINMENT_URL}/${vin}`,
      }),
      keepUnusedDataFor: 5,
    }),
    deleteAppointment: builder.mutation({
      query: (appointmentId) => ({
        url: `${APPOINMENT_URL}/${appointmentId}`,
        method: "DELETE",
      }),
    }),
    deleteAppointmentByAdmin: builder.mutation({
      query: (appointmentId) => ({
        url: `${APPOINMENT_URL}/admin/${appointmentId}`,
        method: "DELETE",
      }),
    }),
    getAppointmentsByDate: builder.query({
      query: (date) => ({
        url: `${APPOINMENT_URL}/date/${date}`,
      }),
      keepUnusedDataFor: 5,
      providesTags: (result, error, date) => [{ type: "Appointments", date }],
      async onQueryStarted(date, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {
          dispatch(
            apiSlice.util.updateQueryData(
              "getAppointmentsByDate",
              date,
              () => []
            )
          );
        }
      },
    }),
    getAppointments: builder.query({
      query: () => ({
        url: `${APPOINMENT_URL}`,
      }),
      keepUnusedDataFor: 5,
    }),
    updateAppointmentStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `${APPOINMENT_URL}/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
    }),
    updateAppointmentIsPaid: builder.mutation({
      query: ({ id }) => ({
        url: `${APPOINMENT_URL}/${id}/paid`,
        method: "PATCH",
      }),
    }),
    assignMechanicToAppointment: builder.mutation({
      query: ({ id, mechanicId }) => ({
        url: `${APPOINMENT_URL}/${id}/assign`,
        method: "PATCH",
        body: { mechanicId },
      }),
    }),
    getAssignedAppointments: builder.query({
      query: (mechanicId) => ({
        url: `${APPOINMENT_URL}/mechanic/${mechanicId}`,
      }),
    }),
    getServiceHistory: builder.query({
      query: (userId) => ({
        url: `/api/history/user/${userId}`,
      }),
    }),
    getServiceHistoryByVehicle: builder.query({
      query: (vehicleId) => ({
        url: `/api/history/vehicle/${vehicleId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useMakeAppointmentMutation,
  useViewAppointmentsQuery,
  useDeleteAppointmentMutation,
  useGetAppointmentsByDateQuery,
  useUpdateAppointmentStatusMutation,
  useDeleteAppointmentByAdminMutation,
  useGetAppointmentsQuery,
  useUpdateAppointmentIsPaidMutation,
  useAssignMechanicToAppointmentMutation,
  useGetAssignedAppointmentsQuery,
  useGetServiceHistoryQuery,
  useGetServiceHistoryByVehicleQuery,
} = appointmentApiSlice;
