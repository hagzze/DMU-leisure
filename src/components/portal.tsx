import { createContext, ReactNode, useContext, useEffect, useId, useState } from 'react';
import { StyleSheet, View } from 'react-native';

// Renders overlays (sheets) above everything, inside the app frame.
type Api = { set: (id: string, node: ReactNode | null) => void };

const PortalCtx = createContext<Api | null>(null);

export function PortalHost({ children }: { children: ReactNode }) {
  const [nodes, setNodes] = useState<Record<string, ReactNode>>({});
  const [api] = useState<Api>(() => ({
    set: (id, node) =>
      setNodes((n) => {
        if (node === null) {
          const { [id]: _gone, ...rest } = n;
          return rest;
        }
        return { ...n, [id]: node };
      }),
  }));
  return (
    <PortalCtx.Provider value={api}>
      {children}
      {Object.entries(nodes).map(([id, node]) => (
        <View key={id} style={StyleSheet.absoluteFill} pointerEvents="box-none">
          {node}
        </View>
      ))}
    </PortalCtx.Provider>
  );
}

export function Portal({ children }: { children: ReactNode }) {
  const api = useContext(PortalCtx);
  const id = useId();
  useEffect(() => {
    api?.set(id, children);
  }, [api, id, children]);
  useEffect(() => () => api?.set(id, null), [api, id]);
  return null;
}
