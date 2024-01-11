# @cornerstonejs/calculate-suv
A tiny library for calculating Standardized Uptake Value (SUV) for Nuclear Medicine (i.e. PET, SPECT)

This library follows the logic laid out by the [Quantitative Imaging Biomarkers Alliance (QIBA)](https://www.rsna.org/research/quantitative-imaging-biomarkers-alliance) on their [Wiki page](https://qibawiki.rsna.org/index.php/Standardized_Uptake_Value_(SUV)).

Special thanks to [Salim Kanoun MD](https://github.com/salimkanoun) from [The Cancer University Institute of Toulouse - Oncopole](https://www.oncopole-toulouse.com/en/iuct-oncopole) and [Lysarc](https://lymphoma-research-experts.org/lysarc/) for their assistance.

### How does it work?
You provide an array of instance/frame metadata corresponding to slices in a PET acquisition. The function returns an array of scaling factors, one per slice, which you can use to obtain SUV values.

### Why does the function require an array of metadata values?
This is required because some PET acquisitions have metadata in individual frames which needs to be taken into account.

### What about private tags
The logic in the library is laid out by QIBA, and takes into account private tags included by several vendors (GE, Siemens, Philips). If these tags are provided, they will be used, but they are not required to be provided. If you have values in these tags in your dataset, you must provide them because otherwise you will not obtain the correct result.