# Ids Color Picker

## Description

The color picker consists of a custom element `<ids-color-picker></ids-color-picker>`. Once initialized, it functions similarly to a dropdown except that the list shows a color palette in the popup. After selecting a color selection, the hex code and swatch will be updated with the new value.

## Behavior Guidelines

The Color Picker by default supports colors within a pre-configured palette of IDS colors. You can optionally add your own list of colors by nesting a `<ids-color></ids-color>` custom element inside `<ids-color-picker></ids-color-picker>`.

## Settings and Attributes
- `value` {string} Sets the value attribute to displayed the color of selected `value="#b94e4e"`
- `label` {string} Sets the label attribute which will be displayed above the color picker web component `label="Color Picker"`
- `clearable` {boolean} Sets the clearable attribute which will add the empty color swatch to the list of colors `clearable="true"` Valid values are 'true' | 'false'
- `disabled` {boolean} Sets the disabled attribute which will disabled the entire color picker web component `disabled="true"` Valid values are 'true' | 'false'
- `readonly` {boolean} Sets the readonly attribute. Valid values are 'true' | 'false'
- `suppress-labels` {boolean} If true, the color-swatches will display hex-values instead of labels. Valid values are 'true' | 'false'
- `suppress-tooltips` {boolean} If true, the color-swatches will not display tooltips on mouseover. Valid values are 'true' | 'false'
- `validate` {string} set the validation rule `required`.
- `advanced` {boolean} If set, the component will provide a browser's visual color picker interface, the input will be masked allowing only `#rrggbb` hexadecimal format.

## Code Examples

A basic use case of the color picker with a few color options.
```html
<ids-color-picker></ids-color-picker>
```

The basic color-picker with labels and tooltips disabled
```html
<ids-color-picker suppress-labels suppress-tooltips></ids-color-picker>
```

A basic use case of the color picker with custom color options.
```html
<ids-color-picker>
  <ids-color hex="#b94e4e"></ids-color>
  <ids-color hex="#000000"></ids-color>
  <ids-color hex="#ffffff"></ids-color>
  <ids-color hex="#333333"></ids-color>
  <ids-color hex="#f5f5f5"></ids-color>
  <ids-color hex="#cccccc"></ids-color>
</ids-color-picker>
```

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**
- Adjust the markup to use fields and inputs and labels
```html
<div class="field">
  <label for="background-color">Background Color</label>
  <input class="colorpicker" value="#ffa800" id="background-color" type="text" />
</div>
```

**3.x to 5.x**
- Markup has changed to a custom element `ids-color-picker`
- Can now be imported as a single JS file and used with encapsulated styles.
- If using events, events are now plain JS events (change/input ect)

The IDS Color Picker component is now a WebComponent. The custom colors are the slot items.

```html
<ids-color-picker id="color-picker-1" disabled="false" label="Ids Color Picker">
  <ids-color hex="#1A1A1A"></ids-color>
  <ids-color hex="#292929"></ids-color>
  <ids-color hex="#383838"></ids-color>
  <ids-color hex="#454545"></ids-color>
  <ids-color hex="#5C5C5C"></ids-color>
  <ids-color hex="#737373"></ids-color>
  <ids-color hex="#999999"></ids-color>
  <ids-color hex="#BDBDBD"></ids-color>
</ids-color-picker>
```

## Keyboard Guidelines

- <kbd>Tab / Shift+Tab</kbd>: To navigate color swatches
- <kbd>ArrowDown / ArrowLeft / ArrowRight / ArrowUp</kbd>: To navigate color swatches
- <kbd>Enter / Space</kbd>: To select currently focuses color-swatch
