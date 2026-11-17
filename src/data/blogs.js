// Single source of truth for the Blog section.
// Articles are mirrored in full from Medium (anjumarnab050) — content lives here,
// rendered as blocks: lede | h2 | h3 | p | list | code | quote.
// Inline text supports **bold**, `code`, and [label](url).
// Newest article first.

export const mediumProfile = 'https://medium.com/@anjumarnab050'

export const blogs = [
  {
    slug: 'flutter-3-50-two-materials-problem',
    title: 'Flutter 3.50: Understanding the Two Material Widget Trees and How to Migrate',
    subtitle:
      'What broke when we moved two production apps to material_ui, and the small widgets that fixed it.',
    tags: ['Flutter', 'Dart', 'Migration', 'Material'],
    excerpt:
      'Flutter 3.50 deprecates flutter/material.dart in favor of material_ui — and plugins still on the old library quietly break Material.of(), ScaffoldMessenger.of(), and Theme.of(). The migration, and the two small bridge widgets that fixed our production apps.',
    repo: null,
    url: 'https://medium.com/@anjumarnab050/flutter-3-50-and-the-two-materials-problem-6a4443259e0f',
    content: [
      { type: 'lede', text: 'What broke when we moved two production apps to `material_ui`, and the small widgets that fixed it.' },

      { type: 'h2', text: 'TL;DR' },
      { type: 'p', text: 'Flutter 3.50 deprecates `package:flutter/material.dart` and `package:flutter/cupertino.dart`. Material now lives in a separate package: `material_ui` and `cupertino_ui`.' },
      { type: 'p', text: "The official Dart fix migrates your imports in minutes. It can't migrate every plugin you depend on. Any plugin that still imports the old library gets its widgets placed under ancestors from the new library, and `Material.of()` / `ScaffoldMessenger.of()` / `Theme.of()` quietly stop finding what they need." },
      { type: 'p', text: 'We hit this in a plain MaterialApp app and in a GetX app. Both fixes were small widgets. This post explains why they work.' },

      { type: 'h2', text: 'What Flutter 3.50 changed' },
      {
        type: 'list',
        items: [
          '`package:flutter/material.dart` is now annotated `@Deprecated` ("Use package:material_ui"). Same for cupertino.dart -> cupertino_ui.',
          'The deprecation is only an analyzer info, so the app still compiles.',
          '`material_ui` is not a re-export of the framework code. It is a decoupled copy that lives in flutter/packages.',
        ],
      },
      { type: 'p', text: '**Consequence:** `ThemeData` from material_ui and ThemeData from flutter/material are two different classes. So are Theme, Material, MaterialLocalizations, ScaffoldMessenger, InputDecoration, InkWell, and so on.' },
      { type: 'h3', text: 'Compile-time symptom' },
      {
        type: 'code',
        lang: 'text',
        code: `The argument type 'ThemeData' can't be assigned to the parameter type 'ThemeData?'.
  — 'ThemeData' is from 'package:material_ui/src/theme_data.dart'
  — 'ThemeData' is from 'package:flutter/src/material/theme_data.dart'`,
      },
      { type: 'h3', text: 'Runtime symptom (the dangerous one, because it compiles)' },
      { type: 'quote', text: 'No Material widget found. TextField widgets require a Material widget ancestor.' },

      { type: 'h2', text: 'The official migration (and what it does not cover)' },
      { type: 'p', text: 'Step 1, imports:' },
      {
        type: 'code',
        lang: 'shell',
        code: `flutter pub add material_ui cupertino_ui
dart fix --apply --code=migrate_design_widgets lib
dart fix --apply --code=migrate_design_widgets test`,
      },
      { type: 'p', text: 'Step 2, localizations. `GlobalMaterialLocalizations` now exists in BOTH flutter_localizations and material_ui, so importing both is an ambiguity error. Use the new one:' },
      {
        type: 'code',
        lang: 'dart',
        code: `MaterialApp(
  localizationsDelegates: [
    AppLocalization.delegate,
    ...GlobalMaterialLocalizations.delegates, // material + cupertino + widgets
  ],
)`,
      },
      { type: 'p', text: 'Step 3, plugins that still use the old library. This is where it gets interesting.' },

      { type: 'h3', text: 'What MaterialUiCompatibilityBridge actually does' },
      { type: 'p', text: '`material_ui` ships a temporary (itself deprecated) widget for legacy plugins:' },
      {
        type: 'code',
        lang: 'dart',
        code: `MaterialApp(
  builder: (context, child) {
    // ignore: deprecated_member_use
    return MaterialUiCompatibilityBridge(child: child!);
  },
)`,
      },
      { type: 'p', text: 'Reading its source (`lib/src/migration_utility.dart`), it is a StatelessWidget that does exactly two things:' },
      {
        type: 'list',
        items: [
          '**THEME:** reads the NEW theme with `modern.Theme.of(context)` and wraps the child in a LEGACY Theme built from it.',
          "**LOCALIZATIONS:** wraps the child in `Localizations.override(…)` with the legacy flutter_localizations delegates. Flutter merges these in front of the parent's delegates, so your own custom delegates still resolve below it.",
        ],
      },
      { type: 'p', text: 'What it does NOT provide, and this is the part that bit us: a legacy Material ancestor, and a legacy ScaffoldMessenger. The bridge is about Theme and Localizations. Nothing else.' },

      { type: 'h3', text: 'Why "No Material widget found" happens when both libraries are present' },
      { type: 'p', text: "Widgets like InkWell, TextField, IconButton, ListTile and OutlinedButton call a lookup that walks up the tree for a Material surface. In each library, that surface is that library's own Material widget, and the ink controller it exposes is a private type of that library." },
      { type: 'p', text: 'So: new Scaffold / new Dialog -> provides NEW Material. Old InkWell (inside a plugin) -> looks for OLD Material -> not found -> throws.' },
      { type: 'p', text: 'Before the migration, there was one Material, so an old plugin widget inside a Scaffold just worked. After that, the Scaffold is new, and the plugin widget is old.' },
      { type: 'p', text: "Nothing in the stack trace says 'you have two Material libraries'. You just get a red error box where your dialog or sheet should be." },

      { type: 'h3', text: 'Case 1: A plain MaterialApp app' },
      { type: 'p', text: 'Setup: root is a normal material_ui MaterialApp, bridge in the builder, all our screens use material_ui. The `country_code_picker` plugin (3.4.1) still imports the old library.' },
      { type: 'p', text: "Repro: tap the flag next to any phone field. The dialog opens with red error boxes, and the console says two exceptions: 'No Material widget found' for the search TextField and for each country row's InkWell (both old widgets inside our new Dialog)." },
      { type: 'p', text: "How we verified before fixing: a widget probe that pumps the plugin widget under the app's real setup and records what throws:" },
      {
        type: 'code',
        lang: 'dart',
        code: `testWidgets('country picker', (tester) async {
  await tester.pumpWidget(MaterialApp(
    localizationsDelegates: GlobalMaterialLocalizations.delegates,
    builder: (context, child) => MaterialUiCompatibilityBridge(child: child!),
    home: Scaffold(body: Center(child: CodePickerWidget(initialSelection: 'US'))),
  ));
  await tester.tap(find.byType(CodePickerWidget));
  await tester.pumpAndSettle();
  print(tester.takeException());   // before the fix: "No Material widget found"
});`,
      },
      { type: 'p', text: 'The fix is a widget that gives old widgets an old Material to find:' },
      {
        type: 'code',
        lang: 'dart',
        code: `import 'package:flutter/widgets.dart';
// ignore: deprecated_member_use
import 'package:flutter/material.dart' as legacy;

class LegacyMaterialScopeWidget extends StatelessWidget {
  const LegacyMaterialScopeWidget({super.key, required this.child});
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return legacy.Material(
      type: legacy.MaterialType.transparency,
      child: child,
    );
  }
}`,
      },
      { type: 'p', text: "Usage, wrapping only the plugin's widget and placing it INSIDE the Dialog:" },
      {
        type: 'code',
        lang: 'dart',
        code: `showDialog(
  context: context,
  builder: (context) => Center(
    child: Dialog(
      child: LegacyMaterialScopeWidget(
        child: SelectionDialog(...), // the plugin's widget
      ),
    ),
  ),
);`,
      },
      { type: 'p', text: "Why inside the Dialog and not at the app root? Ink effects (ripples) paint on the nearest Material's canvas. A root-level Material sits behind every opaque surface, so the ripple is painted and then hidden. Inside the Dialog, it paints above the dialog's background and stays visible." },
      { type: 'p', text: "Result: dialog opens, search filters, tapping 'Bangladesh' returns +880, zero exceptions. One wrapper fixed every screen that has a phone field, because they all share the widget." },
      { type: 'p', text: 'It is transparent: it draws nothing and changes no layout or colors. It only gives old widgets something to find. When the plugin migrates to material_ui, delete it.' },

      { type: 'h3', text: 'Case 2: A GetX app (the harder one)' },
      { type: 'p', text: "GetX's GetMaterialApp is built on the OLD MaterialApp. The GetX fork we use imports flutter/material.dart in about 20 of its own files. So here the ROOT of the app is old." },
      { type: 'p', text: '**Problem A:** the theme.' },
      {
        type: 'code',
        lang: 'dart',
        code: `GetMaterialApp(theme: modernThemeData) // compile error: legacy ThemeData expected`,
      },
      { type: 'p', text: "You cannot hand a material_ui ThemeData to GetMaterialApp. Our fix: don't pass it there. Put a new Theme in the builder instead, and let the bridge map it down for legacy plugins:" },
      {
        type: 'code',
        lang: 'dart',
        code: `GetMaterialApp(
  localizationsDelegates: GlobalMaterialLocalizations.delegates,
  builder: (context, child) => Theme(
    data: isDark ? dark : light,                    // NEW theme, added by us
    child: MaterialUiCompatibilityBridge(           // copies it to a legacy Theme
      child: MaterialBridgeWidget(child: child!),
    ),
  ),
)`,
      },
      { type: 'p', text: 'In a normal MaterialApp the new Theme comes for free from theme:, and the bridge just converts it. In GetMaterialApp there is no new Theme to convert, so we create it.' },
      { type: 'p', text: '**Problem B:** modern widgets inside GetX routes. Get.bottomSheet and Get.dialog build on the old BottomSheet / route, which provides only the OLD Material. Our own widgets are new. A new InkWell inside a GetX bottom sheet fails with "No Material widget found".' },
      { type: 'p', text: 'The visible symptom was strange:' },
      {
        type: 'code',
        lang: 'text',
        code: `A RenderFlex overflowed by 99663 pixels on the right.
  Row ordered_product_list_widget.dart:22`,
      },
      { type: 'p', text: "The real error was the first one in the log ('No Material widget found' on the close button's InkWell). An error widget replaced the failed widget, and the layout exploded. Fixing the Material removed the overflow too. Lesson: with cascading Flutter errors, always read the FIRST exception." },
      { type: 'p', text: 'We reproduced it with a throwaway test that mirrors the real builder and opens the sheet through Get.bottomSheet, then confirmed it was gone after the fix.' },
      { type: 'p', text: '**Problem C:** ScaffoldMessenger. Production log:' },
      {
        type: 'quote',
        text: 'Unhandled Exception: No ScaffoldMessenger widget found.\nNavigator widgets require a ScaffoldMessenger widget ancestor.',
      },
      { type: 'p', text: "Two helpers did `ScaffoldMessenger.of(Get.context!).showSnackBar(…)`, one for a connectivity banner and one for a download toast. Get.context is the Navigator's context and the root is an old MaterialApp, so the only messenger above it is the OLD one. The call asks for the NEW one and does not find it. It surfaced as an unhandled async error inside a connectivity listener, which is why it appeared after unrelated API logs." },
      { type: 'p', text: '**Problem D:** MaterialLocalizations. Modern widgets (AppBar, date pickers) need the NEW MaterialLocalizations. GetMaterialApp only adds the old default, so we pass `localizationsDelegates: GlobalMaterialLocalizations.delegates` (new) explicitly.' },
      { type: 'p', text: 'One widget fixes B and C and also covers old plugin widgets:' },
      {
        type: 'code',
        lang: 'dart',
        code: `class MaterialBridgeWidget extends StatelessWidget {
  const MaterialBridgeWidget({super.key, required this.child});
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return ScaffoldMessenger(                          // NEW messenger
      child: legacy.Material(                          // OLD Material for legacy widgets
        type: legacy.MaterialType.transparency,
        child: Material(                               // NEW Material for our widgets
          type: MaterialType.transparency,
          child: child,
        ),
      ),
    );
  }
}`,
      },
      { type: 'p', text: "(legacy is `import 'package:flutter/material.dart' as legacy`; Material and ScaffoldMessenger without a prefix are material_ui)" },
      { type: 'p', text: 'Because the messenger sits above the Navigator, `ScaffoldMessenger.of(Get.context!)` finds it, and SnackBars show on whichever new Scaffold is on screen. We also wrapped each GetX bottom sheet\u2019s content in its own transparent Material so the ripples are visible, for the same paint-order reason as in section 5.' },
      { type: 'p', text: 'We verified with a test mirroring the real builder (snackbar through Get.context, a Get.bottomSheet and a Get.dialog containing InkWell/TextField/TextButton): all pass, zero exceptions.' },

      { type: 'h3', text: 'Versions we used' },
      { type: 'p', text: 'Flutter 3.50.0 (Dart 3.14.0), material_ui 1.11.0, cupertino_ui 1.1.6, country_code_picker 3.4.1, flutter_localizations (SDK), Gradle 9.5.0, AGP 9.3.1, Kotlin 2.4.20.' },

      { type: 'h2', text: 'Key takeaway' },
      { type: 'p', text: "A deprecation that is only an 'info' can hide a runtime break. During the transition, you do not have one Material; you have two, and everything that looks up the tree (Theme, Material, ScaffoldMessenger, MaterialLocalizations) only sees its own copy. The fix is not clever: give each side the ancestors it expects, as close to the widgets that need them as you can, and delete the shims as plugins catch up." },
    ],
  },

  {
    slug: 'designsicle-figma-to-agent-over-mcp',
    title: 'Designsicle: How Design Context Travels From Figma to a Coding Agent Over MCP',
    subtitle:
      'A Figma plugin, a WebSocket relay, and a local MCP server — with the actual code that turns Copy link to selection into an exact spec your agent can build from.',
    tags: ['Figma', 'MCP', 'TypeScript', 'AI Tooling'],
    excerpt:
      "Ask a coding agent to build UI from a screenshot and it guesses — approximate colors, invented spacing. Designsicle hands over the design's real numbers over MCP.",
    repo: { label: 'Designsicle', url: 'https://github.com/anjumArnab/Designscile' },
    url: 'https://medium.com/@anjumarnab050/designsicle-how-design-context-travels-from-figma-to-a-coding-agent-over-mcp-1d47046b1232',
    content: [
      { type: 'lede', text: 'A Figma plugin, a WebSocket relay, and a local MCP server — with the actual code that turns Copy link to selection into an exact spec your agent can build from.' },

      { type: 'h2', text: 'The Problem' },
      { type: 'p', text: "Ask a coding agent to build UI from a screenshot, and it guesses: approximate colors, spacing, invented font sizes, substituted icons. The agent isn't bad at UI — it never had the design's real numbers. So Designsicle's main feature is about handing those numbers over, exactly:" },
      {
        type: 'list',
        ordered: true,
        items: [
          'In Figma, right-click the frame > **Copy link to selection**',
          'Tell your agent: Build this component from scratch: https://www.figma.com/design/…?node-id=4368-321123',
          'The agent fetches the spec, downloads the real assets, and writes the code — listing anything it had to assume',
        ],
      },

      { type: 'h2', text: 'Capturing the context — inside the plugin' },

      { type: 'h3', text: 'The link names the node' },
      { type: 'p', text: 'The URL says `node-id=4368–321123`; the plugin API wants `4368:321123`. After normalization, the link resolves to a node — with one deliberate guard: the plugin reads only the file open in the Figma desktop app (no tokens, no REST), so a link into another file is an actionable error, never a silent spec of the wrong design.' },
      {
        type: 'code',
        lang: 'typescript',
        code: `// plugin/code.ts

async function resolveLinkRoot(link: string): Promise<RootResolution> {
  const parsed = parseFigmaLink(link); // node-id=4368-321123 > "4368:321123"

  if (parsed.nodeId === null) {
    return { ok: false, error: "The link carries no node id…" };
  }

  const openKey = openFileKey();

  if (
    parsed.fileKey !== null &&
    openKey !== null &&
    parsed.fileKey !== openKey
  ) {
    return {
      ok: false,
      error: "The link points at a different file than the one open…",
    };
  }

  const node = await findNodeById(parsed.nodeId); // loads other pages if needed

  return node === null
    ? { ok: false, error: "No node with id …" } : { ok: true, root: node };
}`,
      },

      { type: 'h3', text: 'One node, one line' },
      { type: 'p', text: 'Extraction walks the tree. Each node becomes one of four line types (CONTAINER, TEXT, IMAGE, ICON); images and icons are leaves. A wrapper that adds nothing but nesting collapses into its child. A frame with no auto layout gets its flow **inferred** from geometry — children queuing along one axis without overlap are a Column/Row with gaps, not raw coordinates.' },
      {
        type: 'code',
        lang: 'typescript',
        code: `// plugin/code.ts - one node becomes one spec line; children recurse.

async function extractNode(
  node: SceneNode,
  depth: number,
  isRoot: boolean,
  suffix: string | null,
  needsBox: boolean
): Promise<string[]> {
  if (!isVisible(node)) return [];

  if (node.type === "TEXT") {
    return [await textLine(node, depth, needsBox)];
  }

  if (isImageElement(node)) {
    return [await imageLine(node, depth)]; // IMAGE: …, id 1:23
  }

  if (isIconElement(node)) {
    return [await iconLine(node, depth)]; // ICON: …, id 12:34
  }

  const children = visibleChildren(node);

  // Collapse wrappers that add nothing.
  if (!isRoot && (await isCollapsibleWrapper(node))) {
    return extractNode(children[0], depth, false, suffix, needsBox);
  }

  // No auto layout? Infer Column/Row + per-child gaps from the geometry,
  // or fall back to an honest Stack with raw coordinates.
  const plan = isFlexContainer(node) ? null : planStack(node, children);

  const lines = [
    await containerLine(node, depth, children, plan, needsBox)
  ];

  const order = plan === null ? children : plan.order; // visual order, not z-order

  for (let i = 0; i < order.length; i++) {
    const childLines = await extractNode(
      order[i],
      depth + 1,
      false,
      plan === null ? null : plan.suffixes[i], // "at 24, gap 4" for stacks
      plan === null ? false : plan.childrenNeedBox
    );

    lines.push(...childLines);
  }

  return lines;
}`,
      },

      { type: 'h3', text: 'Defaults pruned, tokens preferred' },
      { type: 'p', text: "Every property descriptor returns *null* for a Figma default. And where a Figma **variable** is bound, the spec emits the variable's *name* instead of the raw value — so generated code lands in your design system, not in magic numbers." },
      {
        type: 'code',
        lang: 'typescript',
        code: `async function measurement(
  node: SceneNode,
  field: string,
  raw: number
): Promise<string> {
  const name = await boundVariableName(node, field); // e.g. "brand/primary"

  return name === null ? num(raw) : name; // token first, number as fallback
}

// Descriptors null-out Figma defaults - "radius 0" never appears in a spec.
return radius > 0 ? "radius " + num(radius) : null;`,
      },

      { type: 'h3', text: 'Passing it over MCP' },
      { type: 'p', text: "A Figma plugin can't be connected to — it can only dial out. And the plugin's sandbox has no sockets (the iframe does, but no node access). So the MCP server hosts the WebSocket, the plugin's iframe dials out to it and retries every 2 seconds, and the server stays deliberately dumb: it knows nothing about designs and nothing about your code. It relays, and it assembles prompts." },
      {
        type: 'quote',
        text: "Agent ──stdio/MCP -> MCP server ──WebSocket :3055 -> Plugin iframe ──postMessage -> Plugin sandbox\n(your code) (relay only) (dials out) (ui.html) (code.ts — reads nodes)",
      },
      { type: 'p', text: 'The iframe just forwards between socket and sandbox, keeping the request *id* intact — that *id* is what stops overlapping tool calls from crossing wires:' },
      {
        type: 'code',
        lang: 'javascript',
        code: `// plugin/ui.html - sockets, but no node access: forward.

if (message.type === "get_spec") {
  parent.postMessage(
    {
      pluginMessage: {
        type: "extract",
        requestId: message.id,
        link: message.link
      }
    },
    "*"
  );
}`,
      },
      { type: 'p', text: 'On the server, a tool call becomes a WebSocket request, correlated by id — never by arrival order:' },
      {
        type: 'code',
        lang: 'javascript',
        code: `// server/index.js

function requestFromPlugin(kind, extra) {
  return new Promise((resolve, reject) => {
    if (!isPluginConnected()) {
      return reject(new Error(notConnectedMessage()));
    }

    const id = nextRequestId++;

    const timer = setTimeout(() => {
      pending.delete(id);

      reject(
        new Error("The Designsicle plugin did not respond in time…")
      );
    }, timeoutMs); // 10s for selections, 30s for links and asset sweeps

    pending.set(id, {
      resolve,
      reject,
      timer,
      socket: pluginSocket
    });

    pluginSocket.send(
      JSON.stringify(Object.assign({ type: kind, id }, extra))
    );
  });
}`,
      },
      { type: 'p', text: 'The MCP surface is four tools — `get_selection_spec`, `get_component_image` (a JPEG render, for visually ambiguous layouts), `download_assets` (icons as SVG file contents, images as base64 PNG, addressed by the IDs the spec already gave the agent), and `check_figma_connection`. Descriptions are written for the agent: when to call, how to pick the mode, and that a link must point into the open file. In an MCP world, a tool description is a prompt.' },
      {
        type: 'code',
        lang: 'javascript',
        code: `// server/index.js

server.registerTool(
  "get_selection_spec",
  {
    description:
      "Fetches the design spec for the user's CURRENT Figma selection - or for any " +
      "node they linked - and returns ready-to-follow implementation instructions…",

    inputSchema: {
      mode: z.enum(["redesign", "create"]).optional(),
      target_file: z.string().optional(),
      link: z.string().optional() // the "Copy link to selection" URL
    }
  },
  async (args) => {
    const result = await requestFromPlugin("get_spec", {
      link: args.link
    });

    if (result.ok !== true) {
      return selectionFailure(result);
    }

    const prompt =
      args.mode === "create"
        ? assembleCreatePrompt(result, args.link) : assembleRedesignPrompt(result, args.target_file, args.link);

    return {
      content: [
        {
          type: "text",
          text: prompt
        }
      ]
    };
  }
);`,
      },

      { type: 'h3', text: 'The spec is only half the payload' },
      { type: 'p', text: 'The server never returns the bare spec — it returns spec and instructions, because intent is what turns data into behaviour:' },
      {
        type: 'code',
        lang: 'javascript',
        code: `// server/index.js

function assembleRedesignPrompt(result, targetFile, link) {
  return \`MODE: REDESIGN

TARGET FILE: \${targetFile ?? "not specified - ask the user first"}

FIGMA NODE: \${result.componentName}

UPDATED DESIGN SPEC:

\${result.spec}

INSTRUCTIONS:

1. Read the target file first. Preserve its existing public API - constructor
   parameters, callbacks, state - unless the design clearly requires a change.

2. BUILD sections with no data source using placeholders so they render, then
   explicitly list every placeholder at the end of your response.

3. Derive structure and styling from the spec only. Do NOT invent behaviour,
   navigation, or data-fetching that is not already present.\`;
}`,
      },
      { type: 'p', text: "Create mode differs where it should: follow the codebase's conventions, expose the design's data as constructor parameters. Both modes force the same discipline — list every placeholder you introduced. An agent that fills a ratings row with plausible numbers silently has fabricated content; a tool that silently fabricates is untrustworthy." },

      { type: 'h2', text: 'Try it' },
      {
        type: 'code',
        lang: 'shell',
        code: `cd plugin && npm install && npm run build  # code.js is compiled from code.ts

cd ../server && npm install`,
      },
      { type: 'p', text: "Import *plugin/manifest.json* in the Figma desktop app (the browser can't reach localhost), then let your agent own the server:" },
      {
        type: 'code',
        lang: 'shell',
        code: `opencode mcp add designsicle -- node /absolute/path/to/designsicle/server/index.js`,
      },
      { type: 'p', text: '**Honest limits:** the linked file must be open, plugins need edit access, auto layout produces far better output than inferred absolute positioning, and image/icon detection is heuristic (tunable constants at the top of *code.ts*).' },

      { type: 'h2', text: 'The takeaway' },
      { type: 'p', text: 'The pattern generalizes beyond Figma: **expose the document, not a screenshot**; **prune to what changes behaviour**; **keep knowledge where it lives** — design knowledge in the plugin, code knowledge in the agent, the MCP server in the middle knowing neither; and **ship instructions with the data**, including the demand that the agent confess its assumptions. Copying a link is the smallest gesture a designer can make — with the right plumbing behind it, it\u2019s the most complete handoff they\u2019ll ever give an agent.' },
      { type: 'p', text: 'Source code: [Designsicle](https://github.com/anjumArnab/Designscile)' },
    ],
  },

  {
    slug: 'reading-android-network-usage-in-flutter',
    title: 'Reading Android Network Usage in Flutter with Platform Channels',
    subtitle:
      "How to call Android's NetworkStatsManager from Dart using a MethodChannel, with the permission flow, the gotchas, and a per-app version.",
    tags: ['Flutter', 'Kotlin', 'Platform Channels', 'Android'],
    excerpt:
      'Some Android features have no pub.dev package — data-usage stats are one of them. Reading NetworkStatsManager from Dart through a MethodChannel: the permission flow, the Kotlin side, and the gotchas.',
    repo: { label: 'Ping-Thing', url: 'https://github.com/anjumArnab/Ping-Thing' },
    url: 'https://medium.com/@anjumarnab050/reading-android-network-usage-in-flutter-with-platform-channels-cbd88aab5184',
    content: [
      { type: 'lede', text: "How to call Android's NetworkStatsManager from Dart using a MethodChannel, with the permission flow, the gotchas, and a per-app version." },
      { type: 'p', text: 'Flutter covers most of what an app needs, but some Android features have no pub.dev package, or the package is outdated. Data usage statistics are one of them. When that happens, you write a small piece of native code and talk to it through a **platform channel**.' },
      { type: 'p', text: 'In this post, I walk through a real example: a Flutter app that reads how many bytes the device has sent and received over mobile data and Wi-Fi. I cover the architecture, each Kotlin function, and the required permission.' },

      { type: 'h2', text: 'The architecture' },
      { type: 'quote', text: 'Flutter UI > NetworkService (Dart) > MethodChannel > MainActivity (Kotlin) > Android system APIs' },
      { type: 'p', text: "Dart sends a named message over a `MethodChannel`. Kotlin receives it, calls Android's `NetworkStatsManager`, and sends the result back. Both sides must use the same channel name:" },
      {
        type: 'code',
        lang: 'kotlin',
        code: `private val CHANNEL = "com.example.ping_thing/network_stats"`,
      },
      {
        type: 'code',
        lang: 'dart',
        code: `static const MethodChannel _channel =
    MethodChannel('com.example.ping_thing/network_stats');`,
      },
      { type: 'p', text: 'If the strings differ by even one character, you get a `MissingPluginException`.' },

      { type: 'h2', text: 'Step 1: Registering the handler in Kotlin' },
      { type: 'p', text: 'The handler lives in `configureFlutterEngine`, which runs when the Flutter engine attaches to the activity:' },
      {
        type: 'code',
        lang: 'kotlin',
        code: `override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
    super.configureFlutterEngine(flutterEngine)

    MethodChannel(flutterEngine.dartExecutor.binaryMessenger, CHANNEL)
        .setMethodCallHandler { call, result ->
            when (call.method) {
                "getNetworkStats" -> { /* check permission, fetch stats */ }
                "hasPermission" -> result.success(hasUsageStatsPermission())
                "requestPermission" -> {
                    openUsageAccessSettings()
                    result.success(null)
                }
                else -> result.notImplemented()
            }
        }
}`,
      },
      { type: 'p', text: 'The `when` block works as a router on `call.method`. Every branch must finish with exactly one of `success`, `error`, or `notImplemented`. If it doesn’t, the Dart `await` waits forever.' },

      { type: 'h2', text: 'Step 2: The special permission' },
      { type: 'p', text: 'Reading usage statistics requires `PACKAGE_USAGE_STATS`. This is not a normal runtime permission, so there is no dialog. The user has to enable your app manually under **Settings → Usage access**.' },
      { type: 'p', text: "First, declare it in `AndroidManifest.xml`. Without this, your app won't appear in the Usage access list:" },
      {
        type: 'code',
        lang: 'xml',
        code: `<uses-permission android:name="android.permission.PACKAGE_USAGE_STATS"
    tools:ignore="ProtectedPermissions" />`,
      },
      {
        type: 'code',
        lang: 'kotlin',
        code: `private fun hasUsageStatsPermission(): Boolean {
    val appOps = getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
    val mode = appOps.checkOpNoThrow(
        AppOpsManager.OPSTR_GET_USAGE_STATS,
        Process.myUid(),
        packageName
    )
    return mode == AppOpsManager.MODE_ALLOWED
}`,
      },
      { type: 'p', text: "Let's break this down for anyone new to native Android:" },
      {
        type: 'list',
        items: [
          "**getSystemService(…)** asks Android for a handle to one of its long-lived system services. It's defined on `Context`, and your activity inherits it.",
          '**Context.APP_OPS_SERVICE** is a string constant that identifies the App Ops service. Using the constant avoids typos.',
          '**as AppOpsManager** casts the generic result to the type we need.',
          '**AppOpsManager** tracks which sensitive operations each app can perform.',
          '**checkOpNoThrow** asks whether this app may perform the given operation. It takes the operation name, the app’s UID (a unique numeric ID that Android assigns to each installed app), and the package name. The “NoThrow” variant returns a mode instead of throwing a `SecurityException`.',
          '**MODE_ALLOWED** is one of several possible results (`MODE_IGNORED`, `MODE_ERRORED`, `MODE_DEFAULT`). Only `MODE_ALLOWED` means the user flipped the switch.',
        ],
      },
      { type: 'p', text: 'To send the user to the right settings screen:' },
      {
        type: 'code',
        lang: 'kotlin',
        code: `private fun openUsageAccessSettings() {
    startActivity(Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS))
}`,
      },
      { type: 'p', text: 'Android gives you no callback when the user returns, so you need to re-check on resume. More on that below.' },

      { type: 'h2', text: 'Step 3: Querying the stats' },
      {
        type: 'code',
        lang: 'kotlin',
        code: `private fun getNetworkStats(): Map<String, Long> {
    val statsManager =
        getSystemService(Context.NETWORK_STATS_SERVICE) as NetworkStatsManager

    val endTime = System.currentTimeMillis()
    val startTime = endTime - (30L * 24 * 60 * 60 * 1000)

    var mobileRx = 0L
    var mobileTx = 0L
    var wifiRx = 0L
    var wifiTx = 0L

    try {
        val bucket = statsManager.querySummaryForDevice(
            ConnectivityManager.TYPE_MOBILE, null, startTime, endTime
        )
        mobileRx = bucket.rxBytes
        mobileTx = bucket.txBytes
    } catch (e: Exception) {
        Log.e("NetworkStats", "Mobile query failed", e)
    }

    // same pattern for TYPE_WIFI ...

    return mapOf(
        "mobileRx" to mobileRx,
        "mobileTx" to mobileTx,
        "wifiRx" to wifiRx,
        "wifiTx" to wifiTx
    )
}`,
      },
      { type: 'p', text: 'A few details matter here:' },
      {
        type: 'list',
        items: [
          '**The 30L suffix.** 30 days in milliseconds is 2,592,000,000, which is larger than the maximum 32-bit Int (about 2.147 billion). Starting the chain with a Long literal forces the whole multiplication into 64-bit arithmetic. Without it, the value silently overflows.',
          '**Rx and Tx.** Rx means received (downloaded) bytes. Tx means transmitted (uploaded) bytes.',
          '**The null argument** is the subscriber ID, which identifies a SIM. Passing null means “don’t filter by SIM.”',
          '**The Bucket.** `querySummaryForDevice` returns one aggregated record covering the whole time window.',
          '**Two separate try/catch blocks.** If the mobile query fails (for example on a Wi-Fi-only tablet), the Wi-Fi query still runs.',
          '**mapOf and to.** “key” to value creates a pair, and `mapOf(…)` builds an immutable map. The standard message codec turns this into a Dart Map and each Long into a Dart int.',
        ],
      },

      { type: 'h2', text: 'Step 4: The Dart side' },
      {
        type: 'code',
        lang: 'dart',
        code: `Future<Map<String, dynamic>> getNetworkStats() async {
  try {
    final Map<dynamic, dynamic> result =
        await _channel.invokeMethod('getNetworkStats');
    return {
      'mobileRx': result['mobileRx'] ?? 0,
      'mobileTx': result['mobileTx'] ?? 0,
      'wifiRx': result['wifiRx'] ?? 0,
      'wifiTx': result['wifiTx'] ?? 0,
    };
  } on PlatformException catch (e) {
    throw Exception('Failed to get network stats: \${e.message}');
  }
}`,
      },
      { type: 'p', text: 'When Kotlin calls `result.error(…)`, Dart receives a `PlatformException`. The wrapper converts it into a plain `Exception`, so your UI needs its own try/catch around the call.' },

      { type: 'h2', text: 'Step 5: The Flutter UI' },
      { type: 'p', text: 'The home screen is a `StatefulWidget` that asks for permission when it needs to, loads the stats, and shows one of four states: loading, permission needed, error, or data. It also refetches automatically when the user comes back from Android Settings.' },

      { type: 'h3', text: 'State' },
      { type: 'p', text: 'Six fields drive the whole screen:' },
      {
        type: 'code',
        lang: 'dart',
        code: `class _PingThingHomeState extends State<PingThingHome>
    with WidgetsBindingObserver {
  final NetworkService _networkService = NetworkService();
  Map<String, dynamic>? _networkData;
  bool _isLoading = false;
  bool _needsPermission = false;
  bool _returningFromPermissionSettings = false;
  String? _errorMessage;`,
      },
      { type: 'p', text: '`_networkData` is nullable because nothing has loaded yet. `_returningFromPermissionSettings` is a flag that matters in the next step.' },

      { type: 'h3', text: 'Reacting to the user coming back from Settings' },
      { type: 'p', text: 'Android sends no callback when the user toggles Usage access and returns. So the widget listens to the app lifecycle with `WidgetsBindingObserver`:' },
      {
        type: 'code',
        lang: 'dart',
        code: `@override
void initState() {
  super.initState();
  WidgetsBinding.instance.addObserver(this);
  _fetchNetworkStats();
}

@override
void dispose() {
  WidgetsBinding.instance.removeObserver(this);
  super.dispose();
}

@override
void didChangeAppLifecycleState(AppLifecycleState state) {
  if (state == AppLifecycleState.resumed &&
      _returningFromPermissionSettings) {
    _returningFromPermissionSettings = false;
    _fetchNetworkStats();
  }
}`,
      },
      { type: 'p', text: "The flag keeps this targeted. The app also resumes after a phone call or a notification shade pull, and you don't want to refetch every time. The flag is set only when the user taps the button that opens Settings, and it's cleared as soon as it triggers a reload." },

      { type: 'h3', text: 'Fetching: permission first, then data' },
      {
        type: 'code',
        lang: 'dart',
        code: `Future<void> _fetchNetworkStats() async {
  setState(() {
    _isLoading = true;
    _errorMessage = null;
    _needsPermission = false;
  });

  try {
    if (!await _networkService.hasPermission()) {
      if (!mounted) return;
      setState(() {
        _needsPermission = true;
        _isLoading = false;
      });
      return;
    }

    final data = await _networkService.getNetworkStats();
    if (!mounted) return;
    setState(() {
      _networkData = data;
      _isLoading = false;
    });
  } catch (e) {
    if (!mounted) return;
    setState(() {
      _errorMessage = e.toString();
      _isLoading = false;
    });
  }
}`,
      },
      { type: 'p', text: 'The order matters. The method resets the state flags, then calls `hasPermission()` over the channel. If permission is missing, it shows the permission prompt instead of calling `getNetworkStats()` and getting a `PERMISSION_DENIED` error. Every `await` is followed by `if (!mounted) return;`, because the widget may have been removed from the tree while the native call was running, and calling `setState` on a disposed widget throws.' },
      { type: 'p', text: 'The `catch` block is where the `Exception` thrown by `NetworkService` ends up. Its message goes into `_errorMessage` and is shown on screen.' },

      { type: 'h3', text: 'Opening the Usage access settings' },
      {
        type: 'code',
        lang: 'dart',
        code: `Future<void> _openUsageAccessSettings() async {
  try {
    _returningFromPermissionSettings = true;
    await _networkService.requestPermission();
  } catch (e) {
    _returningFromPermissionSettings = false;
    if (!mounted) return;
    setState(() {
      _errorMessage = e.toString();
    });
  }
}`,
      },
      { type: 'p', text: "The flag is raised before the channel call. If the call fails, the flag is lowered again, so a failed attempt can't trigger a stray reload later." },

      { type: 'h3', text: 'Making raw bytes readable' },
      { type: 'p', text: 'The native side returns plain byte counts, so the UI converts them:' },
      {
        type: 'code',
        lang: 'dart',
        code: `String _formatBytes(int bytes) {
  if (bytes < 1024) return '$bytes B';
  if (bytes < 1024 * 1024) return '\${(bytes / 1024).toStringAsFixed(2)} KB';
  if (bytes < 1024 * 1024 * 1024) {
    return '\${(bytes / (1024 * 1024)).toStringAsFixed(2)} MB';
  }
  return '\${(bytes / (1024 * 1024 * 1024)).toStringAsFixed(2)} GB';
}`,
      },

      { type: 'h2', text: 'Debugging what actually comes back' },
      { type: 'p', text: 'To see the map in Kotlin, log it with `android.util.Log`:' },
      {
        type: 'code',
        lang: 'kotlin',
        code: `import android.util.Log

val result = mapOf(
    "mobileRx" to mobileRx,
    "mobileTx" to mobileTx,
    "wifiRx" to wifiRx,
    "wifiTx" to wifiTx
)
Log.d("NetworkStats", "Stats map: $result")
return result`,
      },
      { type: 'p', text: "Filter the output with `adb logcat -s NetworkStats`, or type `NetworkStats` in Android Studio's Logcat filter. You should see `int` for every value. If you see all zeros, a query probably failed silently, so check Logcat for the stack trace." },

      { type: 'h2', text: 'Takeaways' },
      {
        type: 'list',
        items: [
          'A `MethodChannel` is just a named pipe with string method names. Keep the channel name identical on both sides.',
          'Always finish every handler branch with `success`, `error`, or `notImplemented`.',
          '`PACKAGE_USAGE_STATS` is a special permission: declare it in the manifest, send the user to Settings, and re-check on resume.',
          'Know which API you need. `querySummaryForDevice` is device-wide, while `queryDetailsForUid` is per-app.',
          'Never swallow native errors silently. Log them, and surface them to Dart.',
        ],
      },
      { type: 'p', text: "Once you've written your first channel, the pattern is the same for any native feature: define the contract, handle it in Kotlin, wrap it in a small Dart service, and handle the failure cases explicitly." },
      { type: 'p', text: 'Source code: [Ping-Thing](https://github.com/anjumArnab/Ping-Thing)' },
    ],
  },

  {
    slug: 'account-switching-like-a-pro',
    title: 'Account Switching Like a Pro: Firebase Authentication, Firebase Admin SDK, Cloud Functions',
    subtitle: null,
    tags: ['Flutter', 'Firebase', 'Auth'],
    excerpt:
      'Manage multiple Firebase accounts in one Flutter app — custom tokens minted by a Cloud Function, stored securely, one tap to switch. No more logging in and out.',
    repo: null,
    url: 'https://medium.com/@anjumarnab050/account-switching-like-a-pro-firebase-authentication-firebase-admin-sdk-cloud-functions-ed64b36b4054',
    content: [
      { type: 'lede', text: "Tired of constantly logging in and out of your app with multiple accounts? Well, say no more! Here's a seamless way to manage multiple accounts in your Flutter app using Firebase Authentication and custom tokens — because who has time to keep entering passwords?" },
      { type: 'p', text: "So, here's how it works:" },
      { type: 'p', text: '**User Logs In (The Usual Way):** First, the user enters their email and password (just like any regular login). After a successful login, we grab their unique ID (UID) and send it over to Firebase Cloud Functions.' },
      { type: 'p', text: '**Cloud Function Magic:** The Cloud Function takes the UID and creates a custom token just for that user. Think of it as a golden key that lets them unlock their account without the hassle of typing in their credentials every single time!' },
      { type: 'p', text: '**Store That Token (Safely, of Course):** We securely store this new custom token on the user’s device using `FlutterSecureStorage`. So whenever they need it, it’s just one tap away (no more remembering passwords).' },
      { type: 'p', text: "**Jump Between Accounts:** Now, when the user decides they want to switch to another account, they don't have to log out and go through the whole painful login process. Instead, they just grab the stored custom token from `FlutterSecureStorage`, and boom — they're instantly logged in with the new account." },
      {
        type: 'code',
        lang: 'dart',
        code: `/// Step 1: User signs in with email & password

UserCredential userCredential = await FirebaseAuth.instance
    .signInWithEmailAndPassword(email: email, password: password);

String uid = userCredential.user!.uid;

/// Step 2.1: Send UID to Cloud Function to get a custom token
final callable = FirebaseFunctions.instance.httpsCallable('getCustomToken');
final result = await callable.call({'uid': uid});
final customToken = result.data['customToken'];`,
      },
      {
        type: 'code',
        lang: 'javascript',
        code: `/// Step 2.2 Cloud Function (Node.js):

exports.getCustomToken = functions.https.onCall(async (data, context) => {
  // Verify that the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const uid = data.uid;
  if (!uid) {
    throw new functions.https.HttpsError('invalid-argument', 'UID is required');
  }

  // Verify that the UID passed matches the authenticated user's UID
  if (context.auth.uid !== uid) {
    throw new functions.https.HttpsError('permission-denied', 'You do not have permission to request a custom token for this UID');
  }

  try {
    const customToken = await admin.auth().createCustomToken(uid);
    return { customToken };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});`,
      },
      {
        type: 'code',
        lang: 'dart',
        code: `/// Step 3: Store custom token securely on the client
final storage = FlutterSecureStorage();

await storage.write(key: '\${uid}_token', value: customToken);
await storage.write(key: '\${uid}_email', value: email); // Optional
await storage.write(key: '\${uid}_label', value: "Work Account"); // Optional

// Then later when switching accounts:
String uid = "user1UID"; // or get from saved list
String? customToken = await storage.read(key: '\${uid}_token');

if (customToken != null) {
  await FirebaseAuth.instance.signInWithCustomToken(customToken);
}`,
      },
      { type: 'p', text: 'This method allows multiple accounts to live happily side-by-side in one app with zero hassle. And the best part? It keeps everything secure while making account switching smoother than buttered toast.' },
      { type: 'p', text: 'So go ahead, add that **Add another account** feature to your app and make your users’ lives a little bit easier.' },
    ],
  },

  {
    slug: 'restful-api-integration-in-flutter-ep-01',
    title: 'Comprehensive Guide to RESTful API Integration in Flutter [Episode 01]',
    subtitle: null,
    tags: ['Flutter', 'Dart', 'REST API'],
    excerpt:
      'From reading API docs and modeling JSON responses to wiring an API service into the UI — with search, sorting, and lazy loading. The complete first episode of the series.',
    repo: { label: 'Pseudo-JSON', url: 'https://github.com/anjumArnab/Pseudo-JSON' },
    url: 'https://medium.com/@anjumarnab050/comprehensive-guide-to-restful-api-integration-in-flutter-episode-01-ab625dc5c74b',
    content: [
      { type: 'h2', text: 'What is an API?' },
      { type: 'p', text: "APIs (Application Programming Interfaces) play a crucial role in modern software development by allowing different software applications to communicate seamlessly. An API defines how requests and responses should be structured, enabling interaction between systems such as web services, databases, or operating systems. For instance, the Windows API facilitates communication between applications and the OS, while Flutter's `intl` package provides APIs for date formatting and localization. APIs can be categorized into RESTful APIs, SOAP APIs, GraphQL APIs, and WebSocket APIs, each serving different purposes based on their use cases." },

      { type: 'h2', text: 'What does API Integration mean?' },
      { type: 'p', text: 'API integration is the process of connecting an application with external or internal APIs to enable data exchange and extended functionalities without building everything from scratch. This integration is essential for real-time data updates, enhancing user experience, and reducing development time. Common use cases in Flutter include fetching product data from an e-commerce API, user authentication via Firebase, and integrating third-party services like Google Maps or payment gateways.' },

      { type: 'h2', text: 'HTTP Protocol' },
      { type: 'p', text: 'Hypertext Transfer Protocol is the foundation of RESTful (Representational State Transfer) APIs, enabling communication via stateless requests and responses. It is a request-response protocol used by clients (such as web browsers and mobile apps) to communicate with servers. HTTP operates on a stateless model, meaning each request is independent and does not retain session information. The protocol follows a client-server architecture where the client sends requests to a server, which processes them and returns a response. HTTP messages are formatted using request and response headers, which include metadata such as content type, authentication details, and caching policies. The standard port for HTTP is 80, while its secure counterpart, HTTPS (Hypertext Transfer Protocol Secure), operates on port 443, ensuring encrypted communication using SSL/TLS.' },
      { type: 'p', text: 'One of the key aspects of HTTP is its support for **CRUD (Create, Read, Update, Delete)** operations, which are fundamental actions for managing resources in web applications. These operations map to HTTP methods: **POST** is used to create new resources on the server, often with data sent in the request body; **GET** is used to retrieve existing resources and does not modify data; **PUT** is employed to update existing resources by replacing them with new data; **PATCH** is a variation of **PUT** that applies partial updates; and **DELETE** is used to remove resources from the server. These CRUD operations are crucial in **RESTful API** design, where they help manage resources efficiently.' },
      { type: 'p', text: 'HTTP also includes response **status codes** that indicate the outcome of a request. Some common status codes include **200 OK (successful request)**, **201 Created (successful resource creation)**, **400 Bad Request (client error due to invalid syntax)**, **401 Unauthorized (authentication required)**, **403 Forbidden (access denied)**, **404 Not Found (resource not available)**, **500 Internal Server Error (server failure)**, and more. Additionally, HTTP supports headers that control request behavior, such as Content-Type (specifying data format like JSON or XML), Authorization (for authentication), and Cache-Control (for optimizing data retrieval).' },
      { type: 'p', text: 'Modern web applications heavily rely on HTTP for data exchange, particularly when interacting with RESTful APIs. These APIs follow REST principles and use HTTP methods to perform CRUD operations on resources, usually formatted in JSON or XML.' },

      { type: 'h3', text: 'HTTP Request' },
      { type: 'p', text: 'A client (like a web browser or a mobile app) makes a GET request to retrieve a list of products sorted by title in ascending order.' },
      {
        type: 'code',
        lang: 'http',
        code: `GET /products?sortBy=title&order=asc HTTP/1.1
Host: dummyjson.com
User-Agent: PostmanRuntime/7.29.2
Accept: application/json
Connection: keep-alive`,
      },
      { type: 'h3', text: 'HTTP Response' },
      { type: 'p', text: 'The server processes the request and returns a response in JSON format:' },
      {
        type: 'code',
        lang: 'json',
        code: `HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 512
Connection: keep-alive
{
  "products": [
    {
      "id": 1,
      "title": "Apple MacBook Pro",
      "description": "MacBook Pro 2022 model with M1 chip",
      "price": 1299,
      "category": "laptops",
      "brand": "Apple"
    },
    {
      "id": 2,
      "title": "Asus ROG Laptop",
      "description": "Gaming laptop with high performance",
      "price": 1599,
      "category": "laptops",
      "brand": "Asus"
    }
  ],
  "total": 100,
  "skip": 0,
  "limit": 10
}`,
      },
      { type: 'h3', text: 'Explanation' },
      {
        type: 'list',
        items: [
          'The request is made using the **GET** method to fetch sorted product data.',
          'The query parameters `sortBy=title&order=asc` tell the server to sort products by title in ascending order.',
          'The response includes a status code 200 OK, indicating a successful request.',
          {
            text: 'The response body contains a JSON object with:',
            sub: [
              '**products:** An array of products with details like id, title, description, price, etc.',
              '**total:** The total number of products available.',
              '**skip and limit:** Indicating pagination settings.',
            ],
          },
        ],
      },

      { type: 'h2', text: '1.0 Understanding API Documentation and Endpoints' },
      { type: 'p', text: 'Before implementing an API, it is important to read its documentation and understand its structure. Key elements include the base URL, available endpoints, request methods (GET, POST, PUT, DELETE), required parameters, and authentication mechanisms. For this guide, we will use the [DummyJSON](https://dummyjson.com/) API, which provides endpoints such as:' },
      {
        type: 'list',
        items: [
          'Get all products: https://dummyjson.com/products',
          'Get a single product: https://dummyjson.com/products/1',
          'Search products: https://dummyjson.com/products/search?q=phone',
          'Sort products: https://dummyjson.com/products?sortBy=title&order=asc',
        ],
      },

      { type: 'h2', text: '1.1 Creating a Data Model as per JSON Response' },
      { type: 'p', text: 'The first step in API integration is creating a data model that represents the JSON response structure. This ensures type safety, better code organization, and efficient data handling. If the API response contains nested objects, separate classes should be created for modularity. A well-structured data model makes it easier to manage API responses and avoid runtime errors.' },
      { type: 'p', text: 'To create a data model from the given JSON in Flutter using Dart, start by analyzing the structure of the JSON data. Identify the main entity, which in this case is a Product, and its attributes, including primitive types like id, title, price, and stock, as well as complex nested objects like dimensions, meta, and reviews. Once the structure is clear, create a Dart class named Product with properties corresponding to the JSON keys. Next, define a constructor with named parameters, ensuring that required fields are explicitly marked with the required keyword. To facilitate JSON conversion, implement a fromJson factory method that takes a `Map<String, dynamic>` and maps it to the respective class properties, handling nested objects by parsing them separately into their corresponding model classes, such as Review, Meta, and Dimensions. Similarly, create a toJson method that converts a Dart object back to a JSON map (for POST, PUT, and PATCH requests), ensuring all data can be serialized correctly. Finally, test the model by decoding a sample JSON string into a Dart object using `json.decode()`, and then encode it back to JSON using `json.encode()`, verifying that the structure remains intact. This approach ensures a well-structured and easily maintainable data model for handling API responses in Flutter applications.' },
      {
        type: 'code',
        lang: 'dart',
        code: `class Product {
  final int id;
  final String title;
  final String description;
...
  final Dimensions dimensions;
...

  Product({
    required this.id,
    required this.title,
    required this.description,
...
    required this.dimensions,
...
  });

// converting JSON object to Product model object
  factory Product.fromJson(Map<String, dynamic> json) {
    var tagsList = List<String>.from(json['tags']);
    var reviewsList = (json['reviews'] as List)
        .map((review) => Review.fromJson(review))
        .toList();
    var dimensions = Dimensions.fromJson(json['dimensions']);
    var meta = Meta.fromJson(json['meta']);
    var imagesList = List<String>.from(json['images']);

    return Product(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
..
      dimensions: dimensions,
...
    );
  }
}
...

class Dimensions {
  final double width;
  final double height;
  final double depth;

  Dimensions({
    required this.width,
    required this.height,
    required this.depth,
  });

  factory Dimensions.fromJson(Map<String, dynamic> json) {
    return Dimensions(
      width: json['width'] ?? '',
      height: json['height'] ?? '',
      depth: json['depth'] ?? '',
    );
  }
}

...

class ProductList {
  final List<Product> products;
  final int total;
  final int skip;
  final int limit;

  ProductList({
    required this.products,
    required this.total,
    required this.skip,
    required this.limit,
  });

  factory ProductList.fromJson(Map<String, dynamic> json) {
    var productList = (json['products'] as List)
        .map((product) => Product.fromJson(product))
        .toList();
    return ProductList(
      products: productList,
      total: json['total'] ?? '',
      skip: json['skip'] ?? '',
      limit: json['limit'] ?? '',
    );
  }
}`,
      },

      { type: 'h2', text: '1.2 Setting Up API Service' },
      { type: 'p', text: 'Once the data model is established, an API service file (e.g., `api_service.dart`) is created to manage network requests. This service defines the base URL, endpoints, HTTP methods, and exception handling. Using packages like `http` or `dio`, API calls are made asynchronously with Future and async-await to fetch data efficiently. Proper error handling is essential to manage scenarios like network failures, incorrect responses, and API downtime.' },
      {
        type: 'code',
        lang: 'dart',
        code: `Future<List<Product>?> getProductInfo() async {
  try {
    // Parse the API URL
    final url = Uri.parse('https://dummyjson.com/products');

    // Send a GET request to fetch product data from the API
    final response = await http.get(url);

    // Check if the response status code is 200 (successful)
    if (response.statusCode == 200) {
      // Decode the response body (JSON format) into a Dart object
      var data = jsonDecode(response.body);

      // Ensure the 'products' key exists in the response data
      if (data != null && data['products'] != null) {
        // Extract the list of products from the response
        var productsData = data['products'];

        // Convert the extracted data into a list of Product objects using the fromJson method
        return List<Product>.from(productsData.map((product) => Product.fromJson(product)));
      } else {
        // Return null if 'products' key is missing in the response
        return null;
      }
    } else {
      // Return null if the HTTP response status is not successful
      return null;
    }
  } catch (e) {
    // Catch and handle any exceptions that occur (e.g., network failure, invalid JSON)
    return null;
  }
}

Future<List<Product>?> getSearchProduct(String keyword) async {
  try {
    // Construct the API URL with the search query parameter
    final url = Uri.parse('https://dummyjson.com/products/search?q=$keyword');

    // Send a GET request to fetch products matching the search keyword
    final response = await http.get(url);

    // Check if the response status code is 200 (successful)
    if (response.statusCode == 200) {
      // Decode the response body (JSON format) into a Dart object
      var data = jsonDecode(response.body);

      // Ensure the 'products' key exists in the response data
      if (data != null && data['products'] != null) {
        // Extract the list of products from the response
        var productsData = data['products'];

        // Convert the extracted data into a list of Product objects using the fromJson method
        return List<Product>.from(productsData.map((product) => Product.fromJson(product)));
      } else {
        // Return null if 'products' key is missing in the response
        return null;
      }
    } else {
      // Return null if the HTTP response status is not successful
      return null;
    }
  } catch (e) {
    // Catch and handle any exceptions that occur (e.g., network failure, invalid JSON)
    return null;
  }
}

Future<List<Product>?> getSortProducts(String sortBy, String order) async {
  try {
    // Construct the API URL with sorting parameters
    final url = Uri.parse('https://dummyjson.com/products?sortBy=$sortBy&order=$order');

    // Send a GET request to fetch sorted product data from the API
    final response = await http.get(url);

    // Check if the response status code is 200 (successful)
    if (response.statusCode == 200) {
      // Decode the response body (JSON format) into a Dart object
      var data = jsonDecode(response.body);

      // Ensure the 'products' key exists in the response data
      if (data != null && data['products'] != null) {
        // Extract the list of products from the response
        var productsData = data['products'];

        // Convert the extracted data into a list of Product objects using the fromJson method
        return List<Product>.from(productsData.map((product) => Product.fromJson(product)));
      } else {
        // Return null if 'products' key is missing in the response
        return null;
      }
    } else {
      // Return null if the HTTP response status is not successful
      return null;
    }
  } catch (e) {
    // Catch and handle any exceptions that occur (e.g., network failure, invalid JSON)
    return null;
  }
}`,
      },

      { type: 'h2', text: '1.3 Integrating API with UI' },
      { type: 'p', text: 'Integrating the API with the UI involves retrieving data from the API service and displaying it using widgets like FutureBuilder or StreamBuilder. It is essential to handle loading states, errors, and implement pagination for a better user experience. UI components should be designed to ensure smooth user interactions, including search functionalities, filters, and sorting options. Implementing a clean and responsive UI ensures that API data is presented effectively.' },
      {
        type: 'code',
        lang: 'dart',
        code: `class _HomePageState extends State<HomePage> {
  // Future variable to hold the fetched product list
  late Future<List<Product>?> _productsFuture;

  // Controller to manage search input
  TextEditingController searchController = TextEditingController();

  // Variables to store selected sorting criteria
  String _selectedSortBy = 'price'; // Default sorting by price
  String _selectedOrder = 'asc'; // Default order is ascending

  @override
  void initState() {
    super.initState();
    // Fetch product data when the page initializes
    _productsFuture = fetchProductInfo();
  }

  // Function to fetch product information from API
  Future<List<Product>?> fetchProductInfo() async {
    try {
      // Call the API function to get product data
      final products = await getProductInfo();
      return products;
    } catch (e) {
      // Return null in case of an error
      return null;
    }
  }

  // Function to search products based on user input
  Future<void> searchProducts(String keyword) async {
    setState(() {
      // Update the future variable with searched product data
      _productsFuture = getSearchProduct(keyword);
    });
  }

  // Function to update sorting criteria and refresh product list
  void updateSorting(String sortBy, String order) {
    setState(() {
      // Update sorting options
      _selectedSortBy = sortBy;
      _selectedOrder = order;
      // Fetch sorted product data from API
      _productsFuture = getSortProducts(_selectedSortBy, _selectedOrder);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        // App bar title
        title: Text("Welcome Emily"),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: TextField(
              // Assign search text controller
              controller: searchController,
              onChanged: (value) {
                if (value.isNotEmpty) {
                  // If search field is not empty, search for products
                  searchProducts(value);
                } else {
                  setState(() {
                    // Reset product list when search field is cleared
                    _productsFuture = fetchProductInfo();
                  });
                }
              },
            ),
          ),

          // Expanded widget to allow the product list to take up remaining space
          Expanded(
            child: FutureBuilder<List<Product>?>(
              // Use FutureBuilder to handle asynchronous data fetching
              future: _productsFuture,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  // Show a loading indicator while waiting for data
                  return const Center(child: CircularProgressIndicator());
                }
                if (snapshot.hasError) {
                  // Show an error message if data fetching fails
                  return Center(child: Text('Error: \${snapshot.error}'));
                }
                if (snapshot.data == null || snapshot.data!.isEmpty) {
                  // Show a message if no products are found
                  return const Center(child: Text('No products found'));
                }
                return Padding(
                  child: GridView.builder(
                    // Display products in a grid format
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      // Define grid properties (e.g., number of columns)
                    ),
                    itemCount: snapshot.data!.length,
                    itemBuilder: (context, index) {
                      final product = snapshot.data![index];
                      return Transform.scale(
                        child: ProductCard(
                          imageUrl: product.images[0],  // Assign the first image URL from the product's image list
                          title: product.title,  // Set the product title
                          category: product.category,  // Assign the product's category
                          price: product.price,  // Set the product's price
                          discountPercentage: product.discountPercentage,  // Assign the discount percentage for the product
                          brand: product.brand,  // Set the brand name of the product
                        ),
                      );
                    },
                  ),
                );
              },
            ),
          ),
        ],
      ),

      floatingActionButton: FloatingActionButton.small(
        onSelected: (String value) {
          if (value == 'asc' || value == 'desc') {
            // If user selects ascending/descending order, update order
            updateSorting(_selectedSortBy, value);
          } else {
            // Otherwise, update sorting field
            updateSorting(value, _selectedOrder);
          }
        },
        itemBuilder: (context) => [
          _buildPopupMenuItem('price', 'Price'), // Sorting option: Price
          ...
          _buildPopupMenuItem('asc', 'Ascending Order'), // Order option: Ascending
          ...
        ],
      ),
    );
  }

  // Function to create a popup menu item
  PopupMenuItem<String> _buildPopupMenuItem(String value, String text) {
    return PopupMenuItem(
      value: value,
      child: Text(
        text, // Display menu item text
      ),
    );
  }
}`,
      },
      { type: 'p', text: "**Note:** `initState()` is commonly used for API calls in Flutter because it ensures that the data is fetched as soon as the widget is created before the UI is displayed. Since `initState()` is called only once during a widget's lifecycle, it prevents unnecessary API calls that might occur if the call is placed inside `build()`, which runs multiple times. Fetching API data in `initState()` ensures that the necessary data is available before the UI is built, preventing empty or incorrect UI states. Additionally, placing API calls inside `build()` would trigger repeated network requests every time the widget rebuilds, leading to performance issues and unnecessary data fetching." },

      { type: 'h2', text: 'Best Practices for API Integration' },
      { type: 'p', text: 'To enhance API efficiency, best practices should be followed. Using environment variables to store API keys prevents security risks. Caching API responses using `shared_preferences` or `hive` helps reduce redundant API calls. Optimizing network requests using `dio` can improve request handling and response time. Implementing rate limiting and retry mechanisms ensures that the app does not overwhelm the API with frequent requests. Following clean architecture by separating API logic, UI, and business logic (using Provider, Riverpod, or Bloc) makes the app more maintainable.' },
      { type: 'p', text: '**Lazy loading** is an efficient technique for API integration in Flutter, allowing data to be fetched gradually instead of loading everything at once. This approach improves performance and reduces memory usage, especially when dealing with large datasets. Initially, a limited number of items are loaded when the widget first appears. A `ScrollController` is then used to detect when the user scrolls near the bottom of the list, triggering an API call to fetch additional data. The newly retrieved data is appended to the existing list, and the UI is updated dynamically. To prevent multiple simultaneous requests, an isLoading flag is used to manage the state efficiently. By implementing lazy loading with pagination, Flutter apps can ensure smooth scrolling, reduced API load, and an optimized user experience.' },
      {
        type: 'code',
        lang: 'dart',
        code: `class _LazyLoadingGridExampleState extends State<LazyLoadingGridExample> {
  List<dynamic> products = []; // List to store fetched product data.
  int page = 1; // Page number for pagination.
  bool isLoading = false; // Flag to track loading state.
  final ScrollController _scrollController = ScrollController(); // ScrollController to detect scrolling.

  @override
  void initState() {
    super.initState();
    fetchData(); // Fetch initial data when the widget is created.
    _scrollController.addListener(_onScroll); // Detect scrolling.
  }

  Future<void> fetchData() async {
    if (isLoading) return; // Prevent multiple API calls.
    setState(() => isLoading = true); // Set loading to true.

    int skip = (page - 1) * 10; // Calculate the correct \`skip\` value.

    final response = await http.get(
      Uri.parse("https://dummyjson.com/products?limit=10&skip=$skip&select=title,price")
    ); // Fetch paginated data.

    if (response.statusCode == 200) {
      final Map<String, dynamic> data = jsonDecode(response.body); // Decode JSON response.
      setState(() {
        products.addAll(data['products']); // Append new products to the list.
        page++; // Increment page number for the next fetch.
        isLoading = false; // Set loading to false.
      });
    }
  }

  void _onScroll() {
    // Check if the user has scrolled near the bottom and data isn't already loading.
    if (_scrollController.position.pixels >= _scrollController.position.maxScrollExtent - 100 && !isLoading) {
      fetchData(); // Fetch next batch of products.
    }
  }

  @override
  void dispose() {
    _scrollController.dispose(); // Dispose of ScrollController to avoid memory leaks.
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Lazy Loading Products Grid")), // App title.
      body: GridView.builder(
        controller: _scrollController, // Assign ScrollController.
        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
          // Define grid properties (e.g., number of columns)
        ),
        padding: EdgeInsets.all(10), // Add padding around the grid.
        itemCount: products.length + 1, // Extra item for the loading indicator.
        itemBuilder: (context, index) {
          if (index < products.length) { // Check if index is within the data list.
            return Card(
              elevation: 3, // Slight elevation for shadow effect.
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)), // Rounded corners.
              child: Padding(
                padding: EdgeInsets.all(8),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(products[index]['title']), // Display product title.
                    SizedBox(height: 5),
                    Text("\\$\${products[index]['price']}"), // Display product price.
                  ],
                ),
              ),
            );
          } else {
            return isLoading ? Center(child: CircularProgressIndicator()) : SizedBox.shrink();
            // Show a loading indicator if data is being fetched, otherwise an empty space.
          }
        },
      ),
    );
  }
}`,
      },

      { type: 'h2', text: 'Common Issues and Troubleshooting' },
      { type: 'p', text: 'API integration comes with challenges such as incorrect API endpoints, network failures, and JSON parsing errors. If an API request fails, it could be due to an incorrect endpoint, authentication issues, or network connectivity problems. A CORS (Cross-Origin Resource Sharing) policy error might indicate API server restrictions, requiring CORS settings to be enabled. Slow API responses can be optimized by implementing pagination and caching techniques. Proper debugging and logging mechanisms should be used to track and fix API-related issues efficiently.' },
      { type: 'p', text: 'GitHub repo for this project: [anjumArnab/Pseudo-JSON](https://github.com/anjumArnab/Pseudo-JSON)' },
      { type: 'p', text: 'Happy Coding!' },
    ],
  },
]
