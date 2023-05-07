import {useEffect, useState} from 'react';
import {ComponentsMap} from './types';

type Renderable = string | JSX.Element;

const InsertComponentsInTemplate = ({
  template,
  components,
}: {
  template: string;
  components: ComponentsMap;
}) => {
  const [itemsToRender, setItemsToRender] = useState<Renderable[]>([]);

  useEffect(() => {
    const parts = template.split(/[\{\}]/);

    let currentPhrase = '';

    const templateParts = parts.reduce((acc, part, i) => {
      const isAComponent = i % 2 === 1;
      if (isAComponent) {
        if (components[part]) {
          acc.push(components[part]);
        } else {
          console.error('no component called', part);
        }
      } else {
        acc.push(part);
      }

      return acc;
    }, [] as Renderable[]);

    if (currentPhrase) {
      templateParts.push(currentPhrase.trim());
    }

    setItemsToRender(templateParts);
  }, [template, components]);

  return <>{itemsToRender}</>;
};

export default InsertComponentsInTemplate;
