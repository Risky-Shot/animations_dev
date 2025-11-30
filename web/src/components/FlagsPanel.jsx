import { memo, useMemo, useCallback } from "react";
import { Box, Checkbox, Grid } from "@chakra-ui/react";

const CheckboxItem = memo(function CheckboxItem({ checked, value, label, onChange }) {
  // keep handler stable inside item
  const handleChange = useCallback((e) => onChange(e), [onChange]);

  return (
    <Checkbox.Root checked={checked} variant={'solid'} colorPalette={'red'} value={value} size='xs' onChange={handleChange}>
      <Checkbox.HiddenInput />
      <Checkbox.Control />
      <Checkbox.Label>{label}</Checkbox.Label>
    </Checkbox.Root>
  );
});

function FlagsPanel({ localFlags, updateFlag }) {
  // static list of flags -> memoized so identity stable across renders
  const FLAGS = useMemo(() => ([
    { value: 0, label: "NORMAL", checked: true, disabled: true },
    { value: 1, label: "REPEAT" },
    { value: 2, label: "STOP LAST FRAME" },
    { value: 4, label: "UNK 4" },
    { value: 8, label: "UPPERBODY ONLY" },
    { value: 16, label: "ENABLE PLAYER CONTROLS" },
    { value: 32, label: "CANCELABLE" },
    { value: 64, label: "UNK 64" },
    { value: 128, label: "OFFSET POSITION" },
    { value: 256, label: "OFFSET POSITION ENTITY" },
    { value: 512, label: "UNK 512" },
    { value: 1024, label: "UNK 1024" },
    { value: 2048, label: "UNK 2048" },
    { value: 4096, label: "UNK 4096" },
    { value: 8192, label: "UNK 8192" },
    { value: 16384, label: "UNK 16384" },
    { value: 32768, label: "UNK IS ENTITY" }
  ]), []);

  return (
    <Box marginTop='10px' borderRadius={10} borderWidth="1px">
      <Grid templateColumns="repeat(5, 1fr)" gap="0" padding='5px' color='white'>
        {FLAGS.map((f) => {
          if (f.disabled) {
            return (
              <Checkbox.Root key={f.value} checked={true} variant={'solid'} colorPalette={'red'} value={f.value} size='xs' disabled={f.disabled}>
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label>{f.label}</Checkbox.Label>
              </Checkbox.Root>
            );
          }

          const checked = (localFlags & f.value) !== 0;
          // pass primitives and a stable handler reference (updateFlag is expected to be stable via useCallback in parent)
          return (
            <CheckboxItem
              key={f.value}
              checked={checked}
              value={f.value}
              label={f.label}
              onChange={updateFlag}
            />
          );
        })}
      </Grid>
    </Box>
  );
}

export default memo(FlagsPanel);