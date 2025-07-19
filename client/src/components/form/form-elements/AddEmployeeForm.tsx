"use client";

import React, { useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";
import Select from "../Select";
import { EyeCloseIcon, EyeIcon } from "../../../icons";
import { useDropzone } from "react-dropzone";
import TextArea from "../input/TextArea";
import Button from "@/components/ui/button/Button";
import { EmployeeService } from "@/services/EmployeeService";
import { useRouter } from "next/navigation";

export default function AddEmployeeForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    position: "",
    salary: "",
    role: "",
    address: "",
    status: "",
    photo: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({
    name: "",
    email: "",
    phone: "",
    password: "",
    position: "",
    salary: "",
    role: "",
    address: "",
    status: "",
    photo: "",
  });

  const roleOptions = [
    { value: "admin", label: "Admin" },
    { value: "manager", label: "Manager" },
    { value: "employee", label: "Employee" },
  ];

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const onDrop = (acceptedFiles: File[]) => {
    console.log("Files dropped:", acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/webp": [],
      "image/svg+xml": [],
    },
  });

  const validateForm = () => {
    let newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.phone) newErrors.phone = "Phone is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.salary) newErrors.salary = "Salary is required";
    if (!formData.position) newErrors.position = "Position is required";
    if (!formData.role) newErrors.role = "Role is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.status) newErrors.status = "Status is required";
    setErrors(newErrors);
    console.log(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const router = useRouter();

  const handleSubmit = () => {
    if (validateForm()) {
      EmployeeService.createEmployee(formData).then((res) => {
        router.push("/employee");
      });
    }
  };

  return (
    <ComponentCard title="Employee Form" previousAction="/employee">
      <div className="space-y-6">
        <div>
          <Label>Profile Picture</Label>
          <div className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-brand-500">
            <form
              {...getRootProps()}
              className={`dropzone rounded-xl   border-dashed border-gray-300 p-7 lg:p-10
        ${
          isDragActive
            ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
            : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
        }
      `}
              id="demo-upload"
            >
              <input {...getInputProps()} />

              <div className="dz-message flex flex-col items-center !m-0">
                <div className="mb-[22px] flex justify-center">
                  <div className="flex h-[68px] w-[68px]  items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                    <svg
                      className="fill-current"
                      width="29"
                      height="28"
                      viewBox="0 0 29 28"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M14.5019 3.91699C14.2852 3.91699 14.0899 4.00891 13.953 4.15589L8.57363 9.53186C8.28065 9.82466 8.2805 10.2995 8.5733 10.5925C8.8661 10.8855 9.34097 10.8857 9.63396 10.5929L13.7519 6.47752V18.667C13.7519 19.0812 14.0877 19.417 14.5019 19.417C14.9161 19.417 15.2519 19.0812 15.2519 18.667V6.48234L19.3653 10.5929C19.6583 10.8857 20.1332 10.8855 20.426 10.5925C20.7188 10.2995 20.7186 9.82463 20.4256 9.53184L15.0838 4.19378C14.9463 4.02488 14.7367 3.91699 14.5019 3.91699ZM5.91626 18.667C5.91626 18.2528 5.58047 17.917 5.16626 17.917C4.75205 17.917 4.41626 18.2528 4.41626 18.667V21.8337C4.41626 23.0763 5.42362 24.0837 6.66626 24.0837H22.3339C23.5766 24.0837 24.5839 23.0763 24.5839 21.8337V18.667C24.5839 18.2528 24.2482 17.917 23.8339 17.917C23.4197 17.917 23.0839 18.2528 23.0839 18.667V21.8337C23.0839 22.2479 22.7482 22.5837 22.3339 22.5837H6.66626C6.25205 22.5837 5.91626 22.2479 5.91626 21.8337V18.667Z"
                      />
                    </svg>
                  </div>
                </div>

                <h4 className="mb-3 font-semibold text-gray-800 text-theme-xl dark:text-white/90">
                  {isDragActive ? "Drop Files Here" : "Drag & Drop Files Here"}
                </h4>

                <span className=" text-center mb-5 block w-full max-w-[290px] text-sm text-gray-700 dark:text-gray-400">
                  Drag and drop your PNG, JPG, WebP, SVG images here or browse
                </span>

                <span className="font-medium underline text-theme-sm text-brand-500">
                  Browse File
                </span>
              </div>
            </form>
          </div>
        </div>

        <div>
          <Label>Name</Label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            error={errors.name != ""}
            hint={errors.name}
          />
        </div>

        <div>
          <Label>Email</Label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="johndoe@example.com"
            error={errors.email != ""}
            hint={errors.email}
          />
        </div>

        <div>
          <Label>Phone</Label>
          <Input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+62 812-3456-7890"
            error={errors.phone != ""}
            hint={errors.phone}
          />
        </div>

        <div>
          <Label>Password</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              error={errors.password != ""}
              hint={errors.password}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
            >
              {showPassword ? (
                <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
              ) : (
                <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
              )}
            </button>
          </div>
        </div>

        <div>
          <Label>Position</Label>
          <Input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            placeholder="Software Engineer"
            error={errors.position != ""}
            hint={errors.position}
          />
        </div>

        <div>
          <Label>Role</Label>
          <Select
            onChange={(value) => handleSelectChange("role", value)}
            options={roleOptions}
            placeholder="Select a role"
            className="dark:bg-dark-900"
          />
          {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
        </div>

        <div>
          <Label>Salary</Label>
          <Input
            type="text"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            placeholder="5000000"
            error={errors.salary != ""}
            hint={errors.salary}
          />
        </div>

        <div>
          <Label>Address</Label>
          <TextArea
            name="address"
            value={formData.address}
            onChange={(e) => handleChange(e)}
            placeholder="123 Main Street, City"
            rows={3}
            error={errors.address != ""}
            hint={errors.address}
          />
        </div>

        <div>
          <Label>Status</Label>
          <Select
            onChange={(value) => handleSelectChange("status", value)}
            options={statusOptions}
            placeholder="Select status"
            className="dark:bg-dark-900"
          />
          {errors.status && (
            <p className="text-red-500 text-sm">{errors.status}</p>
          )}
        </div>
        <div className="">
          <Button
            variant="primary"
            type="submit"
            onClick={handleSubmit}
            className="bg-blue-600"
          >
            Submit
          </Button>
        </div>
      </div>
    </ComponentCard>
  );
}
