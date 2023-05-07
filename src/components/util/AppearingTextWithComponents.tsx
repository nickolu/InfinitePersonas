import AppearingText from './AppearingText';
import InsertComponentsInTemplate from './InsertComponentsInTemplate';
import {ComponentsMap} from './types';

const AppearingTextWithComponents = ({
  template,
  components,
  AppearingTextProps,
}: {
  template?: string;
  components: ComponentsMap | JSX.Element[];
  intervalInMs?: number;
  AppearingTextProps?: {
    initialDelayInMs?: number;
    intervalInMs?: number;
  };
}) => {
  if (Array.isArray(components)) {
    if (!template) {
      template = createComponentsArrayTemplate(components);
    }
    components = componentsArrayToComponentsMap(components);
  }

  if (!template) {
    return null;
  }

  return (
    <>
      <AppearingText text={template} {...AppearingTextProps}>
        {(appearingText) => {
          return (
            <InsertComponentsInTemplate
              template={appearingText}
              components={components as ComponentsMap}
            />
          );
        }}
      </AppearingText>
    </>
  );
};

function createComponentsArrayTemplate(components: JSX.Element[]) {
  return (components as JSX.Element[]).reduce((acc, _, i) => {
    acc += `{${i}} `;
    return acc;
  }, '');
}

function componentsArrayToComponentsMap(components: JSX.Element[]) {
  return components.reduce((acc, component, i) => {
    acc[i] = component;
    return acc;
  }, {} as ComponentsMap);
}

export default AppearingTextWithComponents;
