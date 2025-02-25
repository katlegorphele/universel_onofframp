import { OnOffRampProvider } from "./context/OnOffRampContext";
import OnOffRampForm from "./components/OnOffRampForm";


export default function Home() {
  return (
    <OnOffRampProvider>
      <OnOffRampForm/>
    </OnOffRampProvider>
  );
}
