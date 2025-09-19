declare module 'colorthief' {
  export default class ColorThief {
    /**
     * Devuelve el color dominante de una imagen.
     * @param img Elemento de imagen (HTMLImageElement)
     * @param quality Calidad del muestreo (por defecto 10)
     * @returns [r, g, b]
     */
    getColor(img: HTMLImageElement, quality?: number): [number, number, number];

    /**
     * Devuelve la paleta de colores de una imagen.
     * @param img Elemento de imagen (HTMLImageElement)
     * @param colorCount Número de colores a extraer
     * @param quality Calidad del muestreo (por defecto 10)
     * @returns Array de [r, g, b]
     */
    getPalette(
      img: HTMLImageElement,
      colorCount?: number,
      quality?: number
    ): [number, number, number][];
  }
}
