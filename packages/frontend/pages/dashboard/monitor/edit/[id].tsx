import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AppLayout from "../../../../components/layout/layout";
import { MonitorForm } from "../../../../components/monitor-form";
import { Monitor } from "../../../../lib/model";
import apiService from "../../../../lib/services/api-service";

export async function getServerSideProps(context) {
  const { id } = context.params;

  return {
    props: { id },
  };
}

export default function Page({ id }: { id: number }) {
  const router = useRouter();
  const [value, setValue] = useState<Monitor | null>(null);

  useEffect(() => {
    apiService.getMonitorById(+router.query.id || id).then(res => {
      setValue(res.data);
    });
  }, []);

  return <AppLayout>{value && <MonitorForm monitor={value} />}</AppLayout>;
}
