import { forwardRef, useState, useRef, useImperativeHandle } from "react";
import { Alert, AlertTitle, Box } from "@mui/material";

interface Props {
  message: string | null | undefined;
}

export type ErrorHandle = {
  show: () => void;
  hide: () => void;
  scrollIntoView: (props: ScrollIntoViewOptions) => void;
};

const Error = forwardRef<ErrorHandle, Props>(({ message }, ref) => {
  const [visible, setVisible] = useState(false);
  const boxRef = useRef<HTMLElement>();
  const showWhenVisible = { display: visible ? '' : 'none' };

  const show = () => {
    setVisible(true);
  }

  const hide = () => {
    setVisible(false);
  }

  useImperativeHandle(ref, () => {
    return {
      show,
      hide,
      scrollIntoView: (props: ScrollIntoViewOptions) => {
        boxRef?.current?.scrollIntoView(props);
      }
    };
  });

  return (
    <Box ref={boxRef} style={{
      ...showWhenVisible,
      marginTop: "1.5rem",
      marginBottom: "1.5rem",
    }}>
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        {message}
      </Alert>
    </Box>
  );
});

export default Error;
