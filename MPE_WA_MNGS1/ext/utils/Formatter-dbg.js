/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([], function () {
	"use strict";
	return {

		/**
		 * Formatter to show multiple users assigned to an OA
		 *  
		 * @param {Integer} NrOfOpActyUserAssignments - Number of assigned Operators.
		 * @param {String} UserDescription - User Name of the first assigned user that shall appear 
		 */
		formateUserName: function (NrOfOpActyUserAssignments, UserDescription) {
			if (NrOfOpActyUserAssignments > 1) {
				return this.getView().getModel("i18n").getResourceBundle().getText("MultipleUsers", [UserDescription, NrOfOpActyUserAssignments - 1]);
			} else {
				return UserDescription;
			}
		},

		/**
		 * Formatter for braces Place holder text
		 * 
		 * @param {String} sText1 - First text
		 * @param {String} sText2 - Seconde text 
		 */
		formateTextWithBraces: function (sText1, sText2) {
			function isEmpty(value) {
				return (value === undefined || value === null || value.length <= 0) ? true : false;
			}

			//if both are empty
			if (isEmpty(sText1) && isEmpty(sText2)) {
				return "";
			} //if only sText1 is empty
			else if (isEmpty(sText1) && !isEmpty(sText2)) {
				return sText2;
			} //if only WorkCenWorkCenterTextter is empty
			else if (!isEmpty(sText1) && isEmpty(sText2)) {
				return sText1;
			} else {
				return this.getView().getModel("i18n").getResourceBundle().getText("bracesPlaceHolder", [sText1, sText2]);
			}
		},

		/**
		 * Formatter for Labor Tracking Text
		 */
		formatLaborTrackingText: function () {
			var laborTrackingStatus = this.checkLaborTrackingOfAllSelectedOAs();

			if (laborTrackingStatus === 0) {
				return this.getView().getModel("i18n").getResourceBundle().getText("TargetOATime");
			} else if (laborTrackingStatus === 1) {
				return this.getView().getModel("i18n").getResourceBundle().getText("TargetLaborTime");
			} else if (laborTrackingStatus === 2) {
				return this.getView().getModel("i18n").getResourceBundle().getText("TargetOATargetLaborTime");
			}

			return this.getView().getModel("i18n").getResourceBundle().getText("TargetOATime");
		},
		
		/*
		 *Return icon color based on flag values
		 *@param {string} ProductionHold - number of holds in order
		 *@return {string} semantic color code
		 */
		setOrderHoldIssueIconColor: function (ProductionHold) {
			if (i2d.mpe.workassign.manages1.ext.utils.Formatter.isOrderOnHold(ProductionHold)) {
				return sap.ui.core.theming.Parameters.get("sapUiNegativeElement");
			} else {
				return sap.ui.core.theming.Parameters.get("sapContent_ForegroundBorderColor");
			}
		},
		
		/**
		 * returns true if ProductionHold is grater than 0
		 * @param {string} ProductionHold - number of holds in order
		 * @return {boolean} true or false
		 */ 
		isOrderOnHold:function(ProductionHold){
			if( parseInt(ProductionHold, 10) >  0){
				return true;
			}else{
				return false;
			}
		}
		
	};
}, true);