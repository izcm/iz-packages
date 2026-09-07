// import { useState, type ReactNode } from "react";
// import { Toaster } from "sonner";

// import {
//   ActionBar,
//   ArrowList,
//   ArrowRow,
//   Bar,
//   Checkbox,
//   ColorWheel,
//   Copyable,
//   DetailFields,
//   Details,
//   DotList,
//   ExpandableRow,
//   Gallery,
//   GalleryItem,
//   IconBadge,
//   IconLink,
//   ImageRow,
//   InlineAmountInput,
//   LabeledValue,
//   LiveBadge,
//   Modal,
//   PillBtn,
//   PillLink,
//   Popover,
//   PulseDot,
//   ResponsiveOverflowGrid,
//   Select,
//   SegmentedControl,
//   Spinner,
//   Tabs,
//   TextInput,
//   TextLink,
//   toast,
//   TxRow,
// } from "../src";

// const IMG =
//   "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect width='64' height='64' fill='%23888'/%3E%3C/svg%3E";

// type Entry = { name: string; category: string; render: () => ReactNode };

// function ArrowListDemo() {
//   const items = ["alpha", "beta", "gamma"];
//   const [selected, setSelected] = useState("alpha");
//   return (
//     <ArrowList
//       items={items}
//       getId={(i) => i}
//       selectedId={selected}
//       onSelect={setSelected}
//     >
//       {({ item, isSelected, onSelect }) => (
//         <ArrowRow key={item} isSelected={isSelected} onSelect={onSelect}>
//           {item}
//         </ArrowRow>
//       )}
//     </ArrowList>
//   );
// }

// function GalleryDemo() {
//   type Item = { id: string; label: string };
//   const items: Item[] = [
//     { id: "1", label: "First" },
//     { id: "2", label: "Second" },
//   ];
//   const [selected, setSelected] = useState<Item>();
//   return (
//     <div style={{ height: 160 }}>
//       <Gallery
//         items={items}
//         selected={selected}
//         onSelect={setSelected}
//         galleryItem={(item) => <GalleryItem image={IMG} title={item.label} />}
//       />
//     </div>
//   );
// }

// function ModalDemo() {
//   const [open, setOpen] = useState(false);
//   return (
//     <>
//       <PillBtn onClick={() => setOpen(true)}>Open modal</PillBtn>
//       <Modal isOpen={open} onClose={() => setOpen(false)}>
//         <div style={{ padding: 16 }}>Modal content</div>
//       </Modal>
//     </>
//   );
// }

// function InlineAmountInputDemo() {
//   const [open, setOpen] = useState(false);
//   return (
//     <InlineAmountInput
//       label="set amount"
//       open={open}
//       onOpen={() => setOpen(true)}
//       onClose={() => setOpen(false)}
//       onSubmit={(amount) => alert(`submitted: ${amount}`)}
//     />
//   );
// }

// function CheckboxDemo() {
//   const [checked, setChecked] = useState(false);
//   return <Checkbox label="agree" checked={checked} onChange={setChecked} />;
// }

// function SelectDemo() {
//   const [value, setValue] = useState("a");
//   return <Select options={["a", "b", "c"]} value={value} onChange={setValue} />;
// }

// function TextInputDemo() {
//   const [value, setValue] = useState("");
//   return (
//     <TextInput
//       value={value}
//       input={{
//         placeholder: "type something",
//         onChange: (e) => setValue(e.target.value),
//       }}
//     />
//   );
// }

// function SegmentedControlDemo() {
//   const [value, setValue] = useState<"interactive" | "historical">(
//     "interactive",
//   );
//   return (
//     <SegmentedControl
//       value={value}
//       onChange={setValue}
//       options={[
//         { label: "Interactive", value: "interactive" },
//         { label: "Historical", value: "historical" },
//       ]}
//     />
//   );
// }

// function TabsDemo() {
//   const [value, setValue] = useState("one");
//   return (
//     <Tabs
//       value={value}
//       onChange={setValue}
//       items={["one", "two", "three"] as const}
//     />
//   );
// }

// function ColorWheelDemo() {
//   const [hex, setHex] = useState("#888888");
//   return (
//     <div>
//       <ColorWheel onChange={setHex} size={100} />
//       <div>picked: {hex}</div>
//     </div>
//   );
// }

// function PopoverDemo() {
//   return (
//     <Popover trigger={<PillBtn>Open popover</PillBtn>}>
//       <div style={{ padding: 8 }}>Popover content</div>
//     </Popover>
//   );
// }

// function ActionBarDemo() {
//   const DummyIcon = () => <span>*</span>;
//   return (
//     <ActionBar
//       items={[
//         {
//           icon: DummyIcon,
//           label: "View Code",
//           onClick: () => alert("view code"),
//         },
//         { icon: DummyIcon, label: "Github Repo", href: "https://github.com" },
//       ]}
//     />
//   );
// }

// function DetailFieldsDemo() {
//   const data = { name: "sample", value: 42 };
//   return (
//     <DetailFields
//       data={data}
//       fields={[
//         { label: "name", getValue: (d) => d.name },
//         { label: "value", getValue: (d) => d.value },
//       ]}
//     />
//   );
// }

// function DetailsDemo() {
//   const data = { name: "sample", value: 42 };
//   return (
//     <Details
//       item={data}
//       title={{
//         field: { label: "name", getValue: (d) => d.name },
//         badge: { label: "new", classes: "" },
//       }}
//       detailsFields={[{ label: "value", getValue: (d) => d.value }]}
//     />
//   );
// }

// function ResponsiveOverflowGridDemo() {
//   const items = ["React", "TypeScript", "Node", "Docker", "Vite", "Tailwind"];
//   return (
//     <ResponsiveOverflowGrid
//       items={items}
//       breakpoints={[{ cols: 3 }]}
//       getKey={(i) => i}
//       renderItem={(i) => <IconBadge label={i} />}
//       renderOverflow={(hidden, count) => <IconBadge label={`+${count}`} />}
//     />
//   );
// }

// function ExpandableRowDemo() {
//   return (
//     <ExpandableRow
//       image={IMG}
//       title="Full title"
//       compactTitle="#1"
//       subtitle="subtitle text"
//       tags={["red", "blue"]}
//       getTagValue={(t) => t}
//       detailsPane={<div>more details here</div>}
//     />
//   );
// }

// const entries: Entry[] = [
//   // data-display
//   {
//     name: "Bar",
//     category: "data-display",
//     render: () => <Bar current={3} total={10} />,
//   },
//   {
//     name: "Copyable",
//     category: "data-display",
//     render: () => <Copyable value="0xabc123">0xabc123</Copyable>,
//   },
//   { name: "DetailFields", category: "data-display", render: DetailFieldsDemo },
//   { name: "Details", category: "data-display", render: DetailsDemo },
//   {
//     name: "DotList",
//     category: "data-display",
//     render: () => <DotList items={["a", "b", "c"]} getValue={(i) => i} />,
//   },
//   {
//     name: "IconBadge",
//     category: "data-display",
//     render: () => <IconBadge label="React" />,
//   },
//   {
//     name: "LabeledValue",
//     category: "data-display",
//     render: () => <LabeledValue label="votes" value="12" />,
//   },
//   {
//     name: "ResponsiveOverflowGrid",
//     category: "data-display",
//     render: ResponsiveOverflowGridDemo,
//   },
//   {
//     name: "ArrowRow",
//     category: "data-display",
//     render: () => (
//       <ArrowList
//         items={["only"]}
//         getId={(i) => i}
//         selectedId="only"
//         onSelect={() => {}}
//       >
//         {({ item, isSelected, onSelect }) => (
//           <ArrowRow key={item} isSelected={isSelected} onSelect={onSelect}>
//             {item}
//           </ArrowRow>
//         )}
//       </ArrowList>
//     ),
//   },
//   {
//     name: "ExpandableRow",
//     category: "data-display",
//     render: ExpandableRowDemo,
//   },
//   {
//     name: "TxRow",
//     category: "data-display",
//     render: () => (
//       <TxRow
//         tx={{
//           hash: "0xdeadbeef",
//           status: "success",
//           label: "order filled",
//           createdAt: Date.now(),
//         }}
//       />
//     ),
//   },

//   // feedback
//   { name: "LiveBadge", category: "feedback", render: () => <LiveBadge /> },
//   { name: "PulseDot", category: "feedback", render: () => <PulseDot active /> },
//   { name: "Spinner", category: "feedback", render: () => <Spinner /> },
//   {
//     name: "Toast",
//     category: "feedback",
//     render: () => (
//       <PillBtn
//         onClick={() =>
//           toast({ title: "hello", description: "this is a toast" })
//         }
//       >
//         Fire toast
//       </PillBtn>
//     ),
//   },

//   // input
//   {
//     name: "PillBtn",
//     category: "input",
//     render: () => <PillBtn>Click me</PillBtn>,
//   },
//   { name: "Checkbox", category: "input", render: CheckboxDemo },
//   { name: "ColorWheel", category: "input", render: ColorWheelDemo },
//   {
//     name: "InlineAmountInput",
//     category: "input",
//     render: InlineAmountInputDemo,
//   },
//   { name: "Select", category: "input", render: SelectDemo },
//   { name: "SegmentedControl", category: "input", render: SegmentedControlDemo },
//   { name: "TextInput", category: "input", render: TextInputDemo },

//   // navigation
//   { name: "ActionBar", category: "navigation", render: ActionBarDemo },
//   { name: "ArrowList", category: "navigation", render: ArrowListDemo },
//   {
//     name: "IconLink",
//     category: "navigation",
//     render: () => <IconLink href="https://github.com">Github repo</IconLink>,
//   },
//   {
//     name: "PillLink",
//     category: "navigation",
//     render: () => <PillLink href="https://etherscan.io">Etherscan</PillLink>,
//   },
//   {
//     name: "TextLink",
//     category: "navigation",
//     render: () => <TextLink href="#">View documentation</TextLink>,
//   },
//   { name: "Tabs", category: "navigation", render: TabsDemo },

//   // media
//   { name: "Gallery", category: "media", render: GalleryDemo },
//   {
//     name: "GalleryItem",
//     category: "media",
//     render: () => <GalleryItem image={IMG} title="item" />,
//   },
//   {
//     name: "ImageRow",
//     category: "media",
//     render: () => (
//       <ImageRow image={IMG} title="Row title" subtitle="subtitle" />
//     ),
//   },

//   // overlays
//   { name: "Modal", category: "overlays", render: ModalDemo },
//   { name: "Popover", category: "overlays", render: PopoverDemo },
// ];

// export function App() {
//   const [filter, setFilter] = useState("");
//   const visible = entries.filter((e) =>
//     e.name.toLowerCase().includes(filter.toLowerCase()),
//   );

//   return (
//     <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif" }}>
//       <Toaster />

//       <nav
//         style={{
//           width: 220,
//           borderRight: "1px solid #333",
//           padding: 12,
//           overflowY: "auto",
//           flexShrink: 0,
//         }}
//       >
//         <input
//           placeholder="filter components..."
//           value={filter}
//           onChange={(e) => setFilter(e.target.value)}
//           style={{ width: "100%", marginBottom: 12, padding: 4 }}
//         />
//         {visible.map((e) => (
//           <a
//             key={e.name}
//             href={`#${e.name}`}
//             style={{ display: "block", padding: "4px 0", fontSize: 14 }}
//           >
//             {e.name}
//           </a>
//         ))}
//       </nav>

//       <main style={{ flex: 1, overflowY: "auto", padding: 24 }}>
//         {visible.map((e) => (
//           <section
//             key={e.name}
//             id={e.name}
//             style={{ padding: "16px 0", borderBottom: "1px solid #333" }}
//           >
//             {e.render()}
//           </section>
//         ))}
//       </main>
//     </div>
//   );
// }
