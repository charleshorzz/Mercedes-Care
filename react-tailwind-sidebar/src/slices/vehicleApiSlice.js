import { VEHICLES_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const vehicleApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVehicles: builder.query({
      query: () => ({
        url: `${VEHICLES_URL}`,
      }),
      providesTags: ["Vehicles"],
      keepUnusedDataFor: 5,
    }),
    getVehicleByVIN: builder.query({
      query: (vin) => ({
        url: `${VEHICLES_URL}/${vin}`,
      }),
      keepUnusedDataFor: 5,
    }),
    getVehicleByVinAdmin: builder.query({
      query: (vin) => ({
        url: `${VEHICLES_URL}/admin/${vin}`,
      }),
      keepUnusedDataFor: 5,
    }),
    getVehiclesByVINs: builder.mutation({
      query: (vinList) => ({
        url: `${VEHICLES_URL}/details`,
        method: "POST",
        body: vinList,
      }),
      invalidatesTags: ["Vehicles"],
    }),
    addVehicle: builder.mutation({
      query: (vehicleData) => ({
        url: `${VEHICLES_URL}`,
        method: "POST",
        body: vehicleData,
      }),
      invalidatesTags: ["Vehicles"],
    }),
    deleteVehicle: builder.mutation({
      query: (vin) => ({
        url: `${VEHICLES_URL}/${vin}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Vehicles"],
    }),
    addVehicleAdmin: builder.mutation({
      query: (vehicleData) => ({
        url: `${VEHICLES_URL}/admin`,
        method: "POST",
        body: vehicleData,
      }),
      invalidatesTags: ["Vehicles"],
    }),
    deleteVehicleAdmin: builder.mutation({
      query: (vin) => ({
        url: `${VEHICLES_URL}/admin/${vin}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Vehicles"],
    }),
  }),
});

export const {
  useGetVehiclesQuery,
  useGetVehicleByVINQuery,
  useGetVehiclesByVINsMutation,
  useAddVehicleMutation,
  useDeleteVehicleMutation,
  useAddVehicleAdminMutation,
  useDeleteVehicleAdminMutation,
  useGetVehicleByVinAdminQuery,
} = vehicleApiSlice;
