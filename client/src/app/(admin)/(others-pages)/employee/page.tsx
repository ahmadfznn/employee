"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import Button from "@/components/ui/button/Button";
import {
  ArrowDownIcon,
  DownloadIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon,
  TrashBinIcon,
} from "@/icons";
import { EmployeeService } from "@/services/EmployeeService";
import { Employee } from "@/types";
import io from "socket.io-client";
import Link from "next/link";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import Alert from "@/components/ui/alert/Alert";
import { HiArrowDownOnSquare, HiDocument } from "react-icons/hi2";
import { exportToExcel } from "@/services/FileService";

const socket = io(process.env.NEXT_PUBLIC_URL, {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

export default function EmployeePage() {
  const [data, setData] = useState<Employee[]>([]);
  const [searchData, setSearchData] = useState<Employee[]>([]);
  const [loadingData, setLoading] = useState<boolean>(true);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user, loading }: { user: Employee; loading: boolean } = useAuth();
  const { isOpen, openModal, closeModal } = useModal();
  const router = useRouter();
  const [alert, setAlert] = useState({
    show: false,
    title: "",
    text: "",
    success: true,
  });
  const [process, setProcess] = useState(false);
  const [idUser, setIdUser] = useState("");

  useEffect(() => {
    if (loading) return;

    if (user?.id) {
      console.log(`User Online: ${user.id}`);
      socket.emit("user-online", user.id);
    }

    socket.on("update-user-status", (users) => {
      setOnlineUsers(users);
      console.log("Online users:", users);
    });

    getData();

    return () => {
      socket.disconnect();
    };
  }, [user, loading, process]);

  const getData = async () => {
    EmployeeService.getAllEmployees().then((res) => {
      if (res.status == 200) {
        console.log(res.data.data);
        const formattedData = res.data.data
          .map((employee: Employee) => ({
            id: employee.id,
            "photo profile": employee.photo_url,
            name: employee.name,
            email: employee.email,
            phone: employee.phone,
            position: employee.position,
            role: employee.role,
            salary: employee.salary,
            address: employee.address,
            status: employee.status,
            "created at": employee.created_at,
            "updated at": employee.updated_at,
          }))
          .sort((a: Employee, b: Employee) => a.name.localeCompare(b.name));

        setData(formattedData);
        setSearchData(formattedData);
        setLoading(false);
      }
    });
  };

  const handleDelete = async (id: string) => {
    EmployeeService.deleteEmployee(id).then((e) => {
      closeModal();
      setProcess(!process);
      if (e.status == 200) {
        setAlert({
          show: true,
          title: "Deleted Succesfully.",
          text: `Employee ${id} deleted successfully.`,
          success: true,
        });
        setTimeout(() => {
          setAlert({
            show: false,
            title: ".",
            text: "",
            success: true,
          });
        }, 3000);
      } else {
        setAlert({
          show: true,
          title: "Deleted failed.",
          text: `Employee ${id} deleted failed.`,
          success: false,
        });
        setTimeout(() => {
          setAlert({
            show: false,
            title: ".",
            text: "",
            success: true,
          });
        }, 3000);
      }
    });
  };

  const handleEdit = (id: string) => {
    router.push(`/employee/edit/${id}`);
  };

  const search = (query: string) => {
    if (query == "") {
      setSearchData(data);
    } else {
      setSearchData(
        data.filter((e) => e.name.toLowerCase().includes(query.toLowerCase()))
      );
    }
  };

  return (
    <div>
      {alert.show && (
        <Alert
          title={alert.text}
          message={alert.text}
          variant={alert.success ? "success" : "error"}
        />
      )}
      <PageBreadcrumb pageTitle="Employee" />
      <div className="space-y-6">
        <ComponentCard
          prefix={
            <>
              <Link href="/employee/add">
                <Button
                  variant="primary"
                  className="bg-blue-500"
                  startIcon={<PlusIcon />}
                />
              </Link>
              <form>
                <div className="relative">
                  <span className="absolute -translate-y-1/2 left-4 top-1/2 pointer-events-none">
                    <svg
                      className="fill-gray-500 dark:fill-gray-400"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                        fill=""
                      />
                    </svg>
                  </span>
                  <input
                    type="text"
                    onChange={(e) => search(e.target.value)}
                    placeholder="Search employee..."
                    className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 p-10 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[250px]"
                  />
                </div>
              </form>
            </>
          }
          suffix={
            <Button
              variant="outline"
              className="bg-blue-500"
              endIcon={<DownloadIcon />}
              onClick={() => exportToExcel(data, "Employee_Data")}
            >
              Download
            </Button>
          }
        >
          <BasicTableOne
            data={searchData}
            loading={loadingData}
            excludedFields={["id", "password", "address"]}
            itemsPerPage={10}
            action={(id) => (
              <>
                <div className="flex items-center gap-2 justify-center">
                  <button
                    onClick={() => router.push(`/employee/${id}`)}
                    className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90"
                  >
                    <EyeIcon />
                  </button>
                  <button
                    onClick={() => {
                      setIdUser(id);
                      openModal();
                    }}
                    className="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-500"
                  >
                    <TrashBinIcon />
                  </button>
                  <button
                    onClick={() => handleEdit(id)}
                    className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90"
                  >
                    <PencilIcon />
                  </button>
                </div>

                <Modal
                  isOpen={isOpen}
                  onClose={closeModal}
                  className="max-w-[400px] m-4"
                >
                  <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                      <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                        Delete Employee
                      </h4>
                      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                        Are you sure to delete this employee?
                      </p>
                    </div>
                    <div className="flex items-center gap-3 px-2 mt-6 justify-center">
                      <Button size="sm" variant="outline" onClick={closeModal}>
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        className="bg-red-600"
                        onClick={() => handleDelete(idUser)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Modal>
              </>
            )}
          />
        </ComponentCard>
      </div>
    </div>
  );
}
