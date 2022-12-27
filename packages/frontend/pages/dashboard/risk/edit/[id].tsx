import AppLayout from "../../../../components/layout/layout";
import { RiskForm } from "../../../../components/risk-form";
import apiService from "../../../../lib/services/api-service";

export function getServerSideProps(context) {
  const { id } = context.params;
  console.log("%c[id].tsx line:6 id", "color: white; background-color: #007acc;", id);
  
  return {
    props: {},
  };
}

export default function Page() {
  return (
    <AppLayout>
      <RiskForm />
    </AppLayout>
  );
}
