"use client";

import React, { useState, useEffect } from "react";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";
import TextArea from "../input/TextArea";
import Button from "@/components/ui/button/Button";
import { useRouter } from "next/navigation";
import { companySettingService } from "@/services/companySettingService"; // Impor service

export default function CompanySettingForm() {
  const [formData, setFormData] = useState({
    standard_work_hours_per_day: 8,
    standard_work_days_per_week: 5,
    start_work_time: "09:00",
    end_work_time: "17:00",
    overtime_rate_multiplier: 1.5,
    name: "",
    address: "",
    phone: "",
    email: "",
    website: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // Efek untuk mengambil data dari API saat komponen dimuat
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await companySettingService.getCompany();
        const { company: companyData, settings: settingsData } =
          response.data.data;

        // Update state formData dengan data dari API
        setFormData({
          name: companyData?.name || "",
          address: companyData?.address || "",
          phone: companyData?.phone || "",
          email: companyData?.email || "",
          website: companyData?.website || "",
          standard_work_hours_per_day:
            settingsData?.standard_work_hours_per_day || 8,
          standard_work_days_per_week:
            settingsData?.standard_work_days_per_week || 5,
          start_work_time:
            settingsData?.start_work_time.substring(0, 5) || "09:00",
          end_work_time: settingsData?.end_work_time.substring(0, 5) || "17:00",
          overtime_rate_multiplier:
            settingsData?.overtime_rate_multiplier || 1.5,
        });
      } catch (error) {
        console.error("Failed to fetch company data:", error);
        // Jika data tidak ada (misal: baru pertama kali), biarkan default value
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    let newErrors: Record<string, string> = {};
    if (!formData.standard_work_hours_per_day)
      newErrors.standard_work_hours_per_day =
        "Standard work hours per day is required";
    if (!formData.standard_work_days_per_week)
      newErrors.standard_work_days_per_week =
        "Standard work days per week is required";
    if (!formData.start_work_time)
      newErrors.start_work_time = "Start work time is required";
    if (!formData.end_work_time)
      newErrors.end_work_time = "End work time is required";
    if (!formData.overtime_rate_multiplier)
      newErrors.overtime_rate_multiplier =
        "Overtime rate multiplier is required";
    if (!formData.name) newErrors.name = "Company name is required";
    if (!formData.address) newErrors.address = "Company address is required";
    if (!formData.email) newErrors.email = "Company email is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        await companySettingService.updateCompany(formData);
        alert("Pengaturan perusahaan berhasil diperbarui!");
      } catch (error: any) {
        console.error("Failed to update company data:", error);
        alert(
          `Gagal memperbarui pengaturan: ${
            error?.response?.data?.message || error.message
          }`
        );
      }
    }
  };

  if (loading) {
    return (
      <ComponentCard prefix="Pengaturan Perusahaan" previousAction="/dashboard">
        <p>Loading data...</p>
      </ComponentCard>
    );
  }

  return (
    <ComponentCard prefix="Pengaturan Perusahaan" previousAction="/dashboard">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Informasi Perusahaan
          </h2>
          <div className="mt-4 space-y-4">
            <div>
              <Label>Nama Perusahaan</Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nama PT Anda"
                error={!!errors.name}
                hint={errors.name}
              />
            </div>
            <div>
              <Label>Email Perusahaan</Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="company@example.com"
                error={!!errors.email}
                hint={errors.email}
              />
            </div>
            <div>
              <Label>Nomor Telepon</Label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+62 812-3456-7890"
                error={!!errors.phone}
                hint={errors.phone}
              />
            </div>
            <div>
              <Label>Website</Label>
              <Input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://www.company.com"
                error={!!errors.website}
                hint={errors.website}
              />
            </div>
            <div>
              <Label>Alamat</Label>
              <TextArea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Alamat lengkap perusahaan"
                rows={3}
                error={!!errors.address}
                hint={errors.address}
              />
            </div>
          </div>
        </div>

        <hr className="my-6 border-gray-200 dark:border-gray-700" />

        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Pengaturan Jam Kerja & Lembur
          </h2>
          <div className="mt-4 space-y-4">
            <div>
              <Label>Jam Kerja Standar per Hari</Label>
              <Input
                type="number"
                name="standard_work_hours_per_day"
                value={formData.standard_work_hours_per_day}
                onChange={handleChange}
                placeholder="e.g., 8"
                error={!!errors.standard_work_hours_per_day}
                hint={errors.standard_work_hours_per_day}
              />
            </div>
            <div>
              <Label>Hari Kerja Standar per Minggu</Label>
              <Input
                type="number"
                name="standard_work_days_per_week"
                value={formData.standard_work_days_per_week}
                onChange={handleChange}
                placeholder="e.g., 5"
                error={!!errors.standard_work_days_per_week}
                hint={errors.standard_work_days_per_week}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Jam Mulai Kerja</Label>
                <Input
                  type="time"
                  name="start_work_time"
                  value={formData.start_work_time}
                  onChange={handleChange}
                  error={!!errors.start_work_time}
                  hint={errors.start_work_time}
                />
              </div>
              <div>
                <Label>Jam Selesai Kerja</Label>
                <Input
                  type="time"
                  name="end_work_time"
                  value={formData.end_work_time}
                  onChange={handleChange}
                  error={!!errors.end_work_time}
                  hint={errors.end_work_time}
                />
              </div>
            </div>
            <div>
              <Label>Pengali Tarif Lembur</Label>
              <Input
                type="number"
                name="overtime_rate_multiplier"
                step={0.1}
                value={formData.overtime_rate_multiplier}
                onChange={handleChange}
                placeholder="e.g., 1.5"
                error={!!errors.overtime_rate_multiplier}
                hint={errors.overtime_rate_multiplier}
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button
            variant="primary"
            type="submit"
            onClick={handleSubmit}
            className="bg-blue-600"
          >
            Simpan Pengaturan
          </Button>
        </div>
      </div>
    </ComponentCard>
  );
}
