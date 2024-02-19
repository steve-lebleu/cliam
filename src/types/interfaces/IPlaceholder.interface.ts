  /**
   * Describe placeholder values used in templates by the Cliam render engine
   */
export interface IPlaceholder {

  /**
   * @description Placeholder values related to the company
   */
  company: {

    /**
     * @description Name of the company
     */
    name: string

    /**
     * @description URL of the company
     */
    url: string

   /**
    * @description Values related to the company location
    */
    location?: {
      street: string
      num: string
      city: string
      zip: string
      country: string
    }

    /**
     * @description Email address of the company
     */
    email?: string

    /**
     * @description Phone numlber of the company
     */
    phone?: string

    /**
     * @description Social networks of the company
     */
    socials?: Array<{ name: string, url: string, icon: string }>
  }

  /**
   * @description Theme values
   */
  theme?: {
    logo: string
    primaryColor: string
    secondaryColor: string
    tertiaryColor: string
    quaternaryColor: string
  }
}