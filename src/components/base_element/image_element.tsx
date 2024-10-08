import { ImageIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { useDrag } from 'react-dnd';
import { ItemTypes } from '@/store/constants';
import {
  usePrintElementListStore,
  defaultImageElement,
  usePrintAreaPosition,
  IPrintElementListType,
  IPrintAreaPositionStoreType,
  MyDropResult,
  sourceElementTypes,
  IPrintRecordElementListType,
  usePrintRecordElementListStore,
} from '@/store';
import { v4 as uuidv4 } from 'uuid';
import { useRef } from 'react';
interface ITmageProps {
  sourceType: sourceElementTypes;
  fieldId?: string;
  content?: string;
}

export const ImageElement: React.FC<React.PropsWithChildren<ITmageProps>> = (
  props,
) => {
  const { sourceType, fieldId, content } = props;
  const addPrintElement = usePrintElementListStore(
    (state: IPrintElementListType) => state.addPrintElement,
  );
  const { addPrintRecordElement } = usePrintRecordElementListStore(
    (state: IPrintRecordElementListType) => state,
  );
  const elementRef = useRef<HTMLDivElement>(null);

  const position = usePrintAreaPosition(
    (state: IPrintAreaPositionStoreType) => state.position,
  );

  const [, drag] = useDrag(
    () => ({
      type: ItemTypes.KNIGHT,
      end(_, monitor) {
        let top = 0,
          left = 0;
        if (monitor.didDrop()) {
          const dropRes = monitor.getDropResult<MyDropResult>(); //获取拖拽对象所处容器的数据
          if (dropRes) {
            top = dropRes.top;
            left = dropRes.left;
          }
          const offsetX = elementRef.current?.offsetLeft
            ? elementRef.current?.offsetLeft
            : 0;
          const offsetY = elementRef.current?.offsetTop
            ? elementRef.current?.offsetTop
            : 0;

          if (sourceType === sourceElementTypes.Base) {
            addPrintElement({
              ...defaultImageElement,
              styles: {
                ...defaultImageElement.styles,
                left: left + offsetX - position.left + position.scrollLeft,
                top: top + offsetY - position.top + position.scrollTop,
              },
              sourceType: sourceElementTypes.Base,
              uuid: uuidv4(),
            });
          }
          if (sourceType === sourceElementTypes.Table) {
            addPrintRecordElement({
              ...defaultImageElement,
              styles: {
                ...defaultImageElement.styles,
                left: left + offsetX - position.left + position.scrollLeft,
                top: top + offsetY - position.top + position.scrollTop,
              },
              uuid: uuidv4(),
              sourceType: sourceElementTypes.Table,
              fieldId: fieldId,
            });
          }
        }
      },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [],
  );

  return (
    <div ref={elementRef}>
      <div
        ref={drag}
        id="imageElementId"
        style={{
          position: 'relative',
          zIndex: 100,
        }}
      >
        <Button className="w-[100%] justify-start" variant="outline">
          <ImageIcon className="w-4.h mr-2" />
          {content ? content : 'Image'}
        </Button>
      </div>
    </div>
  );
};
