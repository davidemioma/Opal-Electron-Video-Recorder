import Widget from "./components/global/Widget";
import ControlLayout from "./layouts/ControlLayout";
import AuthButtons from "./components/global/AuthButtons";

function App() {
  return (
    <ControlLayout>
      <AuthButtons />

      <Widget />
    </ControlLayout>
  );
}

export default App;
