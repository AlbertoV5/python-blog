;;; ------------------------------------
;;     SET CUSTOM_ID OF ALL HEADERS
;;--------------------------------------
;; Credit:
;; https://amitp.blogspot.com/2021/04/automatically-generate-ids-for-emacs.html

(defun setup-custom-id-title (title)
  "Convert TITLE to a reasonable filename."
  (setq title (s-downcase title))
  (setq title (s-replace-regexp "[^a-zA-Z0-9]+" "-" title))
  (setq title (s-replace-regexp "-+" "-" title))
  (setq title (s-replace-regexp "^-" "" title))
  (setq title (s-replace-regexp "-$" "" title))
  title)
(defun setup-custom-id-run ()
  (let ((existing-ids (org-map-entries
                     (lambda () (org-entry-get nil "CUSTOM_ID")))))
    (org-map-entries
     (lambda ()
       (let* ((custom-id (org-entry-get nil "CUSTOM_ID"))
              (heading (org-heading-components))
              (level (nth 0 heading))
              (todo (nth 2 heading))
              (headline (nth 4 heading))
              (slug (setup-custom-id-title headline))
              (duplicate-id (member slug existing-ids)))
         (when (and (< level 4)
                    (not todo)
                    (not duplicate-id))
           (message "Adding entry %s to %s" slug headline)
           (org-entry-put nil "CUSTOM_ID" slug)))))))
(setup-custom-id-run)
